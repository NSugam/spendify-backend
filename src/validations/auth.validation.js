const { z } = require('zod');

const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot exceed 50 characters'),

    username: z.string()
        .trim()
        .toLowerCase()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username cannot exceed 20 characters')
        .regex(
            /^[a-z0-9_]+$/,
            'Username can only contain letters, numbers and underscores'
        ),

    email: z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password cannot exceed 72 characters')
});

const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z.string()
        .min(1, 'Password is required')
        .max(72, 'Password cannot exceed 72 characters')
});

module.exports = {
    registerSchema,
    loginSchema
};