const { z } = require('zod');

const nepaliDateSchema = z.object({
    year: z.number().int().min(2000).max(2090),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(32),
    formatted: z.string().optional()
});

const createTransactionSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),

    amount: z.number()
        .positive('Amount must be greater than zero'),

    type: z.enum(['income', 'expense']),

    category: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),

    englishDate: z.coerce.date().optional(),

    nepaliDate: nepaliDateSchema.optional(),

    iconColor: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
        .optional(),

    note: z.string()
        .trim()
        .max(500, 'Note cannot exceed 500 characters')
        .optional()
}).refine(
    (data) => (data.englishDate !== undefined) !== (data.nepaliDate !== undefined),
    {
        message: 'Provide either englishDate or nepaliDate',
        path: ['englishDate']
    }
);

const updateTransactionSchema = z.object({
    name: z.string()
        .trim()
        .min(2)
        .max(50)
        .optional(),

    amount: z.number()
        .positive('Amount must be greater than zero')
        .optional(),

    type: z.enum(['income', 'expense']).optional(),

    category: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
        .optional(),

    englishDate: z.coerce.date().optional(),

    nepaliDate: nepaliDateSchema.optional(),

    iconColor: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
        .optional(),

    note: z.string()
        .trim()
        .max(500)
        .optional()
}).refine(
    (data) => !(data.englishDate !== undefined && data.nepaliDate !== undefined),
    {
        message: 'Provide either englishDate or nepaliDate',
        path: ['englishDate']
    }
).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);

const getTransactionsSchema = z.object({
    calendar: z.enum(['english', 'nepali']).optional(),

    year: z.coerce.number()
        .int()
        .positive()
        .optional(),

    month: z.coerce.number()
        .int()
        .min(1)
        .max(12)
        .optional()
}).refine(
    (data) => {
        const hasCalendar = !!data.calendar;
        const hasYear = data.year !== undefined;
        const hasMonth = data.month !== undefined;

        return (
            (!hasCalendar && !hasYear && !hasMonth) ||
            (hasCalendar && hasYear && hasMonth)
        );
    },
    {
        message: 'Calendar, year and month must be provided together'
    }
);

module.exports = {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionsSchema
};