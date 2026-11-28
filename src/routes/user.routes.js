const router = require('express').Router();

const userController = require('../controllers/user.controller');
const userDeviceController = require('../controllers/userDevice.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const uploadImage = require('../middleware/uploadImage');
const {
    findFriendsSchema,
    updateProfileSchema
} = require('../validations/user.validation');
const {
    registerDeviceSchema,
    unregisterDeviceSchema
} = require('../validations/userDevice.validation');

// Get user profile
router.get('/profile', authenticate, userController.getProfile);
router.get('/friends', authenticate, validate(findFriendsSchema, 'query'), userController.findFriends);
router.patch('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.post('/profile/image', authenticate, uploadImage, userController.uploadProfileImage);
router.post('/devices', authenticate, validate(registerDeviceSchema), userDeviceController.registerDevice);
router.delete('/devices', authenticate, validate(unregisterDeviceSchema), userDeviceController.unregisterDevice);

module.exports = router;