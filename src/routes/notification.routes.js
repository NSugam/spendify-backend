const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { createTransactionSchema } = require('../validations/transaction.validation');
const notificationController = require('../controllers/notification.controller');

router.post('/test', authenticate, notificationController.testNotification);

module.exports = router;