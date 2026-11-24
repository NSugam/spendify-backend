const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const authenticate = async (req, res, next) => {
    const cookie = process.env.AUTH_COOKIE;
    const token = req.cookies[cookie];
    if (!token) throw new AppError('Invalid request. Please login to continue.', 403);

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new AppError('Invalid or expired token', 401);
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
        throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
        throw new AppError('Your account is inactive', 403);
    }

    // Attach authenticated user to request
    req.user = user;

    next();
};

module.exports = authenticate;