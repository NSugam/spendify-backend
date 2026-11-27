const { sendNotificationToUser } = require(
    "../services/notification.service"
);

const responseManager = require("../utils/responseManager");

const testNotification = async (req, res) => {
    const result = await sendNotificationToUser(
        req.user._id,
        {
            title: "Spendify Test",
            body: "Your FCM notification is working successfully!"
        },
        {
            type: "test",
            screen: "home"
        }
    );

    return responseManager.success(
        res,
        200,
        "Test notification processed",
        result
    );
};

module.exports = {
    testNotification
};