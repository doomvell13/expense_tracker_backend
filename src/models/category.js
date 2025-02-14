import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  icon: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create a compound index for name and user, allowing the same category names for different users
categorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);