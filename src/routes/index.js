const router = require('express').Router();
const testRoutes = require('./test.routes')
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const categoryRoutes = require('./category.routes')

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

module.exports = router;