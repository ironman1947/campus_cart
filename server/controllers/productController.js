const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

exports.getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (category && category !== 'All') {
            query.category = category;
        }

        const products = await Product.find(query).populate('sellerId', 'name email phone').sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('sellerId', 'name email phone');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        
        // Validation
        if (!title || !description || !price || !category) {
            return res.status(400).json({ msg: 'Please provide all required fields (title, description, price, category)' });
        }

        // Image handling
        if (!req.file) {
             return res.status(400).json({ msg: 'Please upload an image' });
        }

        // Check if uploads directory exists, create if not
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const image = req.file.path.replace(/\\/g, "/"); // Normalize path

        const newProduct = new Product({
            title,
            description,
            price,
            category,
            image,
            sellerId: req.user.id
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error('Error in createProduct:', err.message);
        // Clean up file if product creation fails
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (fileErr) {
                console.error('Error deleting file:', fileErr.message);
            }
        }
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check user
        if (product.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete image file if exists
        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (fileErr) {
                    console.error('Error deleting image file:', fileErr.message);
                }
            }
        }
        
        await product.deleteOne();

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error('Error in deleteProduct:', err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
