const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile - This line is causing the error
// router.get('/profile', authController.getProfile); 

// Check if the controller function exists before using it
if (authController.getProfile) {
  router.get('/profile', authController.getProfile);
} else {
  router.get('/profile', (req, res) => {
    res.status(501).json({ message: 'Profile functionality not yet implemented' });
  });
}

// Logout user
router.post('/logout', authController.logout);

module.exports = router;