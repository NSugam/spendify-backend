const { z } = require('zod');

const reminderSchema = z.object({
    enabled: z.boolean().optional(),
    repeat: z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly']).optional(),
    date: z.coerce.date().nullable().optional(),
    time: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time')
        .nullable()
        .optional(),
    weekdays: z.array(z.number().int().min(1).max(7)).optional(),
    dayOfMonth: z.number().int().min(1).max(31).nullable().optional()
});

const createNoteSchema = z.object({
    title: z.string()
        .trim()
        .min(1, 'Title is required')
        .max(150, 'Title cannot exceed 150 characters'),
    description: z.string()
        .trim()
        .max(5000, 'Description cannot exceed 5000 characters')
        .optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    color: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
        .optional(),
    reminder: reminderSchema.optional()
});

module.exports = {
    createNoteSchema
};
