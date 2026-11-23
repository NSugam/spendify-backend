const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const responseManager = require('../utils/responseManager');
const seedDefaultCategories = require('../utils/seedDefaultCategories');

const register = async (req, res) => {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new AppError('Email already registered', 409);
        }

        throw new AppError('Username already taken', 409);
    }

    const user = await User.create({ name, username, email, password, categories: seedDefaultCategories() });

    const token = jwt.sign(
        { sub: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return responseManager.success(res, 201, 'Account created successfully',
        { user, token }
    );
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Invalid email or password', 401);
    if (!user.isActive) throw new AppError('Your account is inactive', 403);

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new AppError('Invalid email or password', 401);

    // Update last login
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

    // Generate JWT
    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userData = user.toJSON();
    return responseManager.success(res, 200, 'Login successful', { user: userData, token });
};

module.exports = {
    register, login
};