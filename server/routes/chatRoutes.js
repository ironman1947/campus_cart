const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const Message = require("../models/Message");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// ======================================================
// GET CHAT HISTORY — simplified, no hard auth blocks
// GET /api/chat/history/:productId?otherUserId=...
// ======================================================
router.get("/history/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = String(req.user.id);
    const otherUserId = req.query.otherUserId ? String(req.query.otherUserId) : null;

    if (!otherUserId) {
      return res.status(400).json({ msg: "otherUserId query param is required" });
    }

    // Fetch messages between these two users for this product
    const messages = await Message.find({
      productId,
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId),      receiverId: new mongoose.Types.ObjectId(otherUserId) },
        { senderId: new mongoose.Types.ObjectId(otherUserId), receiverId: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();

    res.json({ messages });
  } catch (err) {
    console.error("Chat history error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ======================================================
// GET ALL CONVERSATIONS for logged-in user
// GET /api/chat/conversations
// ======================================================
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId:   new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            productId: "$productId",
            otherUserId: {
              $cond: {
                if:   { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
                then: "$receiverId",
                else: "$senderId",
              },
            },
          },
          lastMessage: { $first: "$message" },
          lastAt:      { $first: "$createdAt" },
        },
      },
      { $sort: { lastAt: -1 } },
      { $limit: 100 },
    ]);

    const conversations = await Promise.all(
      messages.map(async (m) => {
        const productId  = String(m._id.productId);
        const otherUserId = String(m._id.otherUserId);

        let productTitle = "Product";
        let peerName     = "User";
        let peerAvatar   = null;

        try {
          const product = await Product.findById(productId).select("title");
          if (product) productTitle = product.title;
        } catch (_) {}

        try {
          const peer = await User.findById(otherUserId).select("name avatar");
          if (peer) {
            peerName   = peer.name   || "User";
            peerAvatar = peer.avatar || null;
          }
        } catch (_) {}

        return { productId, otherUserId, productTitle, peerName, peerAvatar, lastMessage: m.lastMessage || "", lastAt: m.lastAt };
      })
    );

    res.json({ conversations });
  } catch (err) {
    console.error("Conversations Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
