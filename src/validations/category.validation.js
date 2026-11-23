const { z } = require('zod');

const getCategoriesSchema = z.object({
    type: z.enum(['income', 'expense']).optional()
});

const updateCategorySchema = z.object({
    label: z.string().trim().min(2).max(30).optional(),
    icon: z.string().trim().min(1).optional(),
    type: z.enum(['income', 'expense']).optional(),
    isActive: z.boolean().optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

const createCategorySchema = z.object({
    label: z.string().trim().min(2).max(30),
    value: z.string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9_]+$/, 'Value can only contain lowercase letters, numbers and underscores'),
    icon: z.string().trim().min(1),
    type: z.enum(['income', 'expense'])
});

module.exports = {
    getCategoriesSchema,
    updateCategorySchema,
    createCategorySchema
};