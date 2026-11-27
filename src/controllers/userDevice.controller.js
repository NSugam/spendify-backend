const UserDevice = require('../models/userDevice.model');
const responseManager = require('../utils/responseManager');
const getDeviceInfo = require("../utils/deviceInfo");

const registerDevice = async (req, res) => {
    const { token, platform } = req.body;
    const deviceInfo = getDeviceInfo(req);

    const update = {
        user: req.user._id,
        deviceId: deviceInfo?.deviceId,
        deviceName: deviceInfo?.deviceName,
        osName: deviceInfo?.osName,
        platform,
        isActive: true,
        lastUsedAt: new Date()
    };

    const device = await UserDevice.findOneAndUpdate(
        { token },
        { $set: update },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const activeDevices = await UserDevice.find({ user: req.user._id })
        .sort({ lastUsedAt: -1, createdAt: -1, _id: -1 })
        .limit(2)
        .select('_id')
        .lean();
    const activeDeviceIds = activeDevices.map(({ _id }) => _id);

    await UserDevice.updateMany(
        { user: req.user._id, _id: { $nin: activeDeviceIds } },
        { $set: { isActive: false } }
    );
    await UserDevice.updateMany(
        { user: req.user._id, _id: { $in: activeDeviceIds } },
        { $set: { isActive: true } }
    );

    return responseManager.success(res, 200, 'Device registered successfully', { device });
};

const unregisterDevice = async (req, res) => {
    const { token } = req.body;

    await UserDevice.updateOne(
        { user: req.user._id, token },
        { $set: { isActive: false } }
    );

    return responseManager.success(res, 200, 'Device unregistered successfully');
};

module.exports = {
    registerDevice,
    unregisterDevice
};
