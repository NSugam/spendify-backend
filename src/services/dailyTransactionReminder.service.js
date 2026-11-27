const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const UserDevice = require('../models/userDevice.model');
const { sendNotificationToMultipleUsers } = require('./notification.service');
const getKathmanduDayRange = require('../utils/kathmanduDayRange');

const sendDailyTransactionReminders = async () => {
    const { localDate, start, end } = getKathmanduDayRange();
    const usersWithActiveDevices = await UserDevice.distinct('user', {
        isActive: true,
    });

    if (!usersWithActiveDevices.length) {
        return {
            date: localDate,
            eligibleUserCount: 0,
            successCount: 0,
            failureCount: 0,
        };
    }

    const activeUsers = await User.distinct('_id', {
        _id: { $in: usersWithActiveDevices },
        isActive: true,
    });
    const usersWithTransactions = await Transaction.distinct('user', {
        user: { $in: activeUsers },
        englishDate: { $gte: start, $lt: end },
    });
    const usersWithTransactionsSet = new Set(
        usersWithTransactions.map(userId => userId.toString())
    );
    const eligibleUsers = activeUsers.filter(
        userId => !usersWithTransactionsSet.has(userId.toString())
    );

    if (!eligibleUsers.length) {
        return {
            date: localDate,
            eligibleUserCount: 0,
            successCount: 0,
            failureCount: 0,
        };
    }

    const results = await sendNotificationToMultipleUsers(
        eligibleUsers,
        {
            title: "A little reminder from Spendify 💛",
            body: "Hey! Take a moment to add today's transactions and keep your day up to date. You've got this!",
        },
        {
            type: 'daily_transaction_reminder',
            screen: 'transactions',
        }
    );
    const deliveryCounts = results.reduce(
        (totals, result) => ({
            successCount: totals.successCount + result.successCount,
            failureCount: totals.failureCount + result.failureCount,
        }),
        { successCount: 0, failureCount: 0 }
    );

    return {
        date: localDate,
        eligibleUserCount: eligibleUsers.length,
        ...deliveryCounts,
    };
};

module.exports = { sendDailyTransactionReminders };
