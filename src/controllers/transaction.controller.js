const Transaction = require('../models/transaction.model');
const AppError = require('../utils/AppError');
const responseManager = require('../utils/responseManager');

const createTransaction = async (req, res) => {
    const {
        name,
        amount,
        type,
        category,
        englishDate,
        iconColor,
        note
    } = req.body;

    // Find category belonging to the authenticated user
    const selectedCategory = req.user.categories.id(category);

    if (!selectedCategory || !selectedCategory.isActive) {
        throw new AppError('Invalid or inactive category', 400);
    }

    // Ensure category type matches transaction type
    if (selectedCategory.type !== type) {
        throw new AppError(
            'Category type does not match transaction type',
            400
        );
    }

    const transaction = await Transaction.create({
        user: req.user._id,
        name,
        amount,
        type,
        category,
        englishDate,
        iconColor,
        note
    });

    return responseManager.success(
        res,
        201,
        'Transaction created successfully',
        { transaction }
    );
};

const getTransactions = async (req, res) => {
    const { calendar, year, month } = req.validated.query;

    const filter = {
        user: req.user._id
    };

    if (calendar === 'english') {
        const offset = 5 * 60 + 45;

        const startDate = new Date(
            Date.UTC(year, month - 1, 1) - offset * 60 * 1000
        );

        const endDate = new Date(
            Date.UTC(year, month, 1) - offset * 60 * 1000
        );

        filter.englishDate = {
            $gte: startDate,
            $lt: endDate
        };
    }

    if (calendar === 'nepali') {
        filter['nepaliDate.year'] = year;
        filter['nepaliDate.month'] = month;
    }

    // Fetch transactions and calculate summary simultaneously
    const [transactions, summaryResult] = await Promise.all([
        Transaction.find(filter)
            .sort({ englishDate: -1, createdAt: -1 })
            .lean(),

        Transaction.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,

                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'income'] },
                                '$amount',
                                0
                            ]
                        }
                    },

                    totalExpense: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'expense'] },
                                '$amount',
                                0
                            ]
                        }
                    },

                    totalTransactions: {
                        $sum: 1
                    }
                }
            }
        ])
    ]);

    const categoryMap = new Map(
        req.user.categories.map((category) => [
            category._id.toString(),
            category
        ])
    );

    const formattedTransactions = transactions.map((transaction) => {
        const category = categoryMap.get(
            transaction.category.toString()
        );

        return {
            ...transaction,
            category: category
                ? {
                    _id: category._id,
                    label: category.label,
                    value: category.value,
                    icon: category.icon
                }
                : null
        };
    });

    const summary = summaryResult[0] || {
        totalIncome: 0,
        totalExpense: 0,
        totalTransactions: 0
    };

    return responseManager.success(
        res,
        200,
        'Transactions fetched successfully',
        {
            filter: calendar && year && month ? { calendar, year, month } : null,
            summary: {
                totalTransactions: summary.totalTransactions,
                totalIncome: summary.totalIncome,
                totalExpense: summary.totalExpense,
            },
            transactions: formattedTransactions
        }
    );
};

const updateTransaction = async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        _id: id,
        user: req.user._id
    });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    const updatedType = req.body.type || transaction.type;
    const updatedCategoryId = req.body.category || transaction.category;

    // Find the category belonging to the authenticated user
    const selectedCategory = req.user.categories.id(updatedCategoryId);

    if (!selectedCategory || !selectedCategory.isActive) {
        throw new AppError('Invalid or inactive category', 400);
    }

    // Ensure category type matches transaction type
    if (selectedCategory.type !== updatedType) {
        throw new AppError(
            'Category type does not match transaction type',
            400
        );
    }

    Object.assign(transaction, req.body);

    await transaction.save();

    return responseManager.success(
        res,
        200,
        'Transaction updated successfully',
        {
            transaction: {
                ...transaction.toObject(),
                category: {
                    _id: selectedCategory._id,
                    label: selectedCategory.label,
                    value: selectedCategory.value,
                    icon: selectedCategory.icon
                }
            }
        }
    );
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
        _id: id,
        user: req.user._id
    });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    return responseManager.success(
        res,
        200,
        'Transaction deleted successfully'
    );
};

module.exports = {
    createTransaction, getTransactions, updateTransaction, deleteTransaction
};