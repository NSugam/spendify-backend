const responseManager = require('../utils/responseManager');
const AppError = require('../utils/AppError');
const User = require('../models/user.model');

const uploadProfileImage = async (req, res) => {
    if (!req.file) throw new AppError('Image file is required', 400);

    const formData = new FormData();
    formData.append(
        'file',
        new Blob([req.file.buffer], { type: req.file.mimetype }),
        req.file.originalname
    );

    let response;
    try {
        response = await fetch(
            'https://gateway.neupanesugam.com.np/motomate/api/upload/public/image',
            {
                method: 'POST',
                headers: {
                    deviceId: req.headers.deviceId
                },
                body: formData,
                signal: AbortSignal.timeout(30000)
            }
        );
    } catch (error) {
        throw new AppError('Image upload service is unavailable', 502);
    }

    let uploadResponse;
    try {
        uploadResponse = await response.json();
    } catch (error) {
        throw new AppError('Image upload service returned an invalid response', 502);
    }

    if (
        !response.ok || !uploadResponse || typeof uploadResponse !== 'object' || uploadResponse.success !== true ||
        typeof uploadResponse.data?.url !== 'string'
    ) {
        throw new AppError(
            uploadResponse?.message || uploadResponse?.apiResponseMessage || 'Image upload service failed',
            uploadResponse?.message || uploadResponse?.apiResponseMessage || 502
        );
    }

    req.user.userImageUrl = uploadResponse.data.url;
    await req.user.save();

    return res.status(response.status).json(uploadResponse);
};

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
    uploadProfileImage,
    getProfile,
    updateProfile
};