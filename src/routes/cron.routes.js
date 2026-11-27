const router = require('express').Router();
const cronAuth = require('../middleware/cronAuth');
const cronController = require('../controllers/cron.controller');

router.get(
    '/daily-transaction-reminder',
    cronAuth,
    cronController.sendDailyTransactionReminder
);

module.exports = router;
