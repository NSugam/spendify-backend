const { z } = require('zod');

const sendFriendRequestSchema = z.object({
    username: z.string()
        .trim()
        .toLowerCase()
        .min(3)
        .max(20)
        .regex(/^[a-z0-9_]+$/, 'Invalid username')
});

const friendRequestIdParamsSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid friend request ID')
});

module.exports = {
    sendFriendRequestSchema,
    friendRequestIdParamsSchema
};
