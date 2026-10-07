const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: 30,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Category type is required'],
        },
        color: {
            type: String,
            default: '#6366f1',
        },
        icon: {
            type: String,
            default: '📁',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Compound index: unique category name per user per type
categorySchema.index({ name: 1, user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
