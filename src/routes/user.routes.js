const router = require('express').Router();

const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');

// Get user profile
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;