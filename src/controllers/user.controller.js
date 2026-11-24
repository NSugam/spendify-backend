const responseManager = require('../utils/responseManager');
const AppError = require('../utils/AppError');
const User = require('../models/user.model');

const getProfile = async (req, res) => {
    return responseManager.success(res, 200, 'Profile fetched successfully', { user: req.user });
};

const updateProfile = async (req, res) => {
    if (req.body.username) {
        const existingUser = await User.findOne({
            username: req.body.username,
            _id: { $ne: req.user._id }
        });

        if (existingUser) throw new AppError('Username already taken', 409);
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!user) throw new AppError('User not found', 404);

    return responseManager.success(res, 200, 'Profile updated successfully', { user });
};

module.exports = {
    getProfile,
    updateProfile
};