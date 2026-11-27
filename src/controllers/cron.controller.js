const responseManager = require('../utils/responseManager');
const {
    sendDailyTransactionReminders,
} = require('../services/dailyTransactionReminder.service');

const sendDailyTransactionReminder = async (req, res) => {
    const result = await sendDailyTransactionReminders();

    return responseManager.success(
        res,
        200,
        'Daily transaction reminders processed',
        result
    );
};

module.exports = { sendDailyTransactionReminder };
