const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
// Alias: same as /profile, clearer name for "who am I?"
router.get('/me', auth, getUserProfile);

module.exports = router;
