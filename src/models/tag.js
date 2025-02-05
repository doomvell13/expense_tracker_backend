import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for user and name to ensure uniqueness per user
tagSchema.index({ user: 1, name: 1 }, { unique: true });

// Pre-save middleware to clean up tag name
tagSchema.pre('save', function(next) {
  // Trim whitespace and normalize case
  this.name = this.name.trim();
  next();
});

export default mongoose.model('Tag', tagSchema);