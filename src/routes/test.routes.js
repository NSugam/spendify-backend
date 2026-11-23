const router = require('express').Router();
const { z } = require('zod');
const responseManager = require('../utils/responseManager');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

const testSchema = z.object({
    name: z.string().min(3, 'Name must contain at least 3 characters'),
    email: z.string().email('Invalid email address'),
    age: z.coerce.number().min(18, 'You must be at least 18')
});

router.post('/validate', validate(testSchema), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Validation successful',
        data: req.body
    });
});

router.get('/test', (req, res) => {
    return responseManager.success(
        res,
        200,
        'Spendify API is working!',
        {
            version: '1.0.0'
        }
    );
});

router.get('/error', (req, res, next) => {
    next(new AppError('User not found', 404));
});

router.get('/server-error', (req, res, next) => {
    next(new Error('Something went wrong'));
});

module.exports = router;