const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const notificationController = require('../controllers/notification.controller');

router.post('/test', authenticate, notificationController.testNotification);

module.exports = router;