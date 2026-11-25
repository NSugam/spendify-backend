const router = require('express').Router();

const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const uploadImage = require('../middleware/uploadImage');
const { updateProfileSchema } = require('../validations/user.validation');

// Get user profile
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.post('/profile/image', authenticate, uploadImage, userController.uploadProfileImage);

module.exports = router;