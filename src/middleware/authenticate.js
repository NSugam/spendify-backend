const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new AppError('Invalid authentication token', 401);
    }

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