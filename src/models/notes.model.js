const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        enabled: {
            type: Boolean,
            default: false,
        },

        repeat: {
            type: String,
            enum: ["once", "daily", "weekly", "monthly", "yearly"],
            default: "once",
        },

        date: {
            type: Date,
            default: null,
        },

        time: {
            type: String,
            default: null,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },

        weekdays: {
            type: [{
                type: Number,
                min: 1,
                max: 7,
            }],
            default: [],
        },

        dayOfMonth: {
            type: Number,
            min: 1,
            max: 31,
            default: null,
        },
    },
    { _id: false }
);

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 5000,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        color: {
            type: String,
            default: "#328F89",
            match: /^#[0-9A-Fa-f]{6}$/,
        },

        reminder: {
            type: reminderSchema,
            default: () => ({}),
        },

        isCompleted: {
            type: Boolean,
            default: false,
        },

        completedAt: {
            type: Date,
            default: null,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Optimized queries
noteSchema.index({ user: 1, isCompleted: 1, updatedAt: -1 });

noteSchema.index({ user: 1, "reminder.enabled": 1 });

noteSchema.pre("save", function () {
    if (this.isModified("isCompleted")) {
        this.completedAt = this.isCompleted ? new Date() : null;
    }

    if (this.isCompleted && this.reminder?.enabled) {
        this.reminder.enabled = false;
    }
});

module.exports = mongoose.model("Note", noteSchema);