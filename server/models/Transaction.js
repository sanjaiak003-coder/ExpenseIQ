const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Transaction type is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: 200,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes for common queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
