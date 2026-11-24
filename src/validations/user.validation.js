const { z } = require('zod');

const updateProfileSchema = z.object({
    name: z.string().trim().min(3).max(50).optional(),
    username: z.string()
        .trim()
        .toLowerCase()
        .min(3)
        .max(20)
        .regex(/^[a-z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
        .optional(),
    currency: z.string().trim().min(1).optional(),
    dateFormat: z.enum(['en', 'np']).optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

module.exports = {
    updateProfileSchema
};
