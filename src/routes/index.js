const router = require('express').Router();
const testRoutes = require('./test.routes')
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const categoryRoutes = require('./category.routes')
const notificationRoutes = require('./notification.routes')
const cronRoutes = require('./cron.routes')

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Spendify API is healthy!'
    });
});

router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', require('./transaction.routes'));
router.use("/notification", notificationRoutes);
router.use('/cron', cronRoutes);

module.exports = router;