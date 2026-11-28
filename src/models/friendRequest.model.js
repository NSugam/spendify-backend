const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        pairKey: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending'
        },
        acceptedAt: {
            type: Date,
            default: null
        },
        declinedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

friendRequestSchema.index(
    { pairKey: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'pending' }
    }
);

friendRequestSchema.index({ recipient: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
