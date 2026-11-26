const mongoose = require('mongoose');
const NepaliDate = require('nepali-date-converter');
const AppError = require('../utils/AppError');

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
            required: false
        }
    },
    {
        timestamps: true
    }
);

transactionSchema.pre('validate', function () {
    const previousDateState = this.$locals.transactionDateState;
    const currentNepaliDate = this.nepaliDate || {};
    const englishDateModified = this.isModified('englishDate') &&
        (
            !previousDateState ||
            !this.englishDate ||
            this.englishDate.getTime() !== previousDateState.englishDate
        );
    const nepaliDateModified = this.isModified('nepaliDate') &&
        (
            !previousDateState ||
            currentNepaliDate.year !== previousDateState.nepaliDate.year ||
            currentNepaliDate.month !== previousDateState.nepaliDate.month ||
            currentNepaliDate.day !== previousDateState.nepaliDate.day
        );

    if (
        previousDateState &&
        !englishDateModified &&
        !nepaliDateModified
    ) {
        return;
    }

    if (englishDateModified && nepaliDateModified) {
        throw new AppError('Provide either englishDate or nepaliDate', 400);
    }

    if (nepaliDateModified) {
        const { year, month, day } = this.nepaliDate || {};

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            year < 2000 ||
            year > 2090 ||
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 32
        ) {
            throw new AppError('Invalid Nepali date', 400);
        }

        let nepali;

        try {
            nepali = new NepaliDate(year, month - 1, day);
        } catch {
            throw new AppError('Invalid Nepali date', 400);
        }

        if (
            nepali.getYear() !== year ||
            nepali.getMonth() + 1 !== month ||
            nepali.getDate() !== day
        ) {
            throw new AppError('Invalid Nepali date', 400);
        }

        this.englishDate = nepali.toJsDate();
    }

    if (!this.isNew && !englishDateModified && !nepaliDateModified) return;

    if (
        !this.englishDate ||
        Number.isNaN(this.englishDate.getTime())
    ) {
        throw new AppError('Invalid English date', 400);
    }

    const nepali = new NepaliDate(this.englishDate);

    this.nepaliDate = {
        year: nepali.getYear(),
        month: nepali.getMonth() + 1,
        day: nepali.getDate(),
        formatted: nepali.format('YYYY MMMM DD', 'np')
    };

    this.$locals.transactionDateState = {
        englishDate: this.englishDate.getTime(),
        nepaliDate: {
            year: this.nepaliDate.year,
            month: this.nepaliDate.month,
            day: this.nepaliDate.day
        }
    };
});

transactionSchema.index({
    user: 1,
    'englishDate': 1,
    'nepaliDate.year': 1,
    'nepaliDate.month': 1
});
module.exports = mongoose.model('Transaction', transactionSchema);