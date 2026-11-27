const { timingSafeEqual } = require('crypto');
const AppError = require('../utils/AppError');

const cronAuth = (req, res, next) => {
    const secret = process.env.CRON_SECRET;

    if (!secret) {
        return next(new AppError('Cron authentication is not configured', 500));
    }

    const provided = Buffer.from(req.get('authorization') || '');
    const expected = Buffer.from(`Bearer ${secret}`);

    if (
        provided.length !== expected.length ||
        !timingSafeEqual(provided, expected)
    ) {
        return next(new AppError('Unauthorized', 401));
    }

    return next();
};

module.exports = cronAuth;
