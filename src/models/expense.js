import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false,  // Change from required: true
    trim: true,
    default: ''  // Add default empty string
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for user and date fields
expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;