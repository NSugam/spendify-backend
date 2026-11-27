const mongoose = require("mongoose");

const userDeviceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        deviceId: { type: String, default: null },
        deviceName: { type: String, default: null },
        osName: { type: String, default: null },

        token: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        platform: {
            type: String,
            enum: ["android", "web"],
            required: true,
        },


        isActive: {
            type: Boolean,
            default: true,
        },

        lastUsedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

userDeviceSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model("UserDevice", userDeviceSchema);