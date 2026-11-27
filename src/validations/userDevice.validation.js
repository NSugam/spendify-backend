const { z } = require('zod');

const registerDeviceSchema = z.object({
    token: z.string().trim().min(1),
    platform: z.enum(['android', 'web']),
});

const unregisterDeviceSchema = z.object({
    token: z.string().trim().min(1)
});

module.exports = {
    registerDeviceSchema,
    unregisterDeviceSchema
};
