const mongoose = require('mongoose');
const NepaliDate = require('nepali-date-converter');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        englishDate: { type: Date, required: true, default: Date.now },

        nepaliDate: {
            year: { type: Number, required: false },
            month: { type: Number, required: false },
            day: { type: Number, required: false },
            formatted: { type: String, required: false }
        },

        iconColor: {
            type: String,
            default: '#6BCB45',
            match: /^#[0-9A-Fa-f]{6}$/
        },

        note: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// generate Nepali date before saving
transactionSchema.pre('save', function () {
    if (!this.isModified('englishDate')) return;
    const nepali = new NepaliDate(this.englishDate);

    this.nepaliDate = {
        year: nepali.getYear(),
        month: nepali.getMonth() + 1,
        day: nepali.getDate(),
        formatted: nepali.format('YYYY MMMM DD', 'np')
    };
});

transactionSchema.index({
    user: 1,
    'englishDate': 1,
    'nepaliDate.year': 1,
    'nepaliDate.month': 1
});
module.exports = mongoose.model('Transaction', transactionSchema);