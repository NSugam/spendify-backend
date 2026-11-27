const { getMessaging } = require("firebase-admin/messaging");
const firebaseApp = require("../config/firebase");
const UserDevice = require("../models/userDevice.model");

const messaging = getMessaging(firebaseApp);

const sendNotification = async (token, notification, data = {}) => {
    return messaging.send({
        token,
        notification: {
            title: notification.title,
            body: notification.body,
        },
        data: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                String(value),
            ])
        ),
        android: {
            priority: "high",
            notification: {
                channelId: "default",
                sound: "default",
                defaultSound: true,
                defaultVibrateTimings: true,
            },
        },
    });
};

const sendNotificationToUser = async (
    userId,
    notification,
    data = {}
) => {
    const devices = await UserDevice.find({
        user: userId,
        isActive: true,
    }).select("_id token");

    if (!devices.length) {
        return {
            success: false,
            message: "No active devices found.",
        };
    }

    const tokens = devices.map(device => device.token);

    const response = await messaging.sendEachForMulticast({
        tokens,
        notification: {
            title: notification.title,
            body: notification.body,
        },
        data: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                String(value),
            ])
        ),
        android: {
            priority: "high",
            notification: {
                channelId: "default",
                sound: "default",
            },
        },
    });

    // Deactivate invalid FCM tokens.
    const invalidTokens = [];

    response.responses.forEach((result, index) => {
        if (
            !result.success &&
            [
                "messaging/invalid-registration-token",
                "messaging/registration-token-not-registered",
            ].includes(result.error?.code)
        ) {
            invalidTokens.push(devices[index]._id);
        }
    });

    if (invalidTokens.length) {
        await UserDevice.updateMany(
            { _id: { $in: invalidTokens } },
            { $set: { isActive: false } }
        );
    }

    return {
        success: true,
        totalDevices: devices.length,
        successCount: response.successCount,
        failureCount: response.failureCount,
    };
};

const sendNotificationToMultipleUsers = async (
    userIds,
    notification,
    data = {}
) => {
    const devices = await UserDevice.find({
        user: { $in: userIds },
        isActive: true,
    }).select("_id token");

    // FCM multicast supports a maximum of 500 tokens per request.
    const results = [];

    for (let i = 0; i < devices.length; i += 500) {
        const batch = devices.slice(i, i + 500);

        const response = await messaging.sendEachForMulticast({
            tokens: batch.map(device => device.token),
            notification,
            data: Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    String(value),
                ])
            ),
            android: {
                priority: "high",
                notification: {
                    channelId: "default",
                    sound: "default",
                },
            },
        });

        results.push({
            successCount: response.successCount,
            failureCount: response.failureCount,
        });
    }

    return results;
};

module.exports = {
    sendNotification,
    sendNotificationToUser,
    sendNotificationToMultipleUsers,
};