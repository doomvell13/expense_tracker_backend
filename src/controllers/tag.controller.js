import mongoose from 'mongoose';
import Tag from '../models/tag.js';
import Expense from '../models/expense.js';

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ user: req.user._id })
      .sort({ usageCount: -1, lastUsed: -1 })
      .limit(20);
    res.json(tags);
  } catch (error) {
    console.error('Error in getTags:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addTag = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Tag name is required and must be a string' });
    }

    const cleanName = name.trim();
    if (cleanName.length === 0) {
      return res.status(400).json({ error: 'Tag name cannot be empty' });
    }

    // Try to find and update existing tag
    let tag = await Tag.findOneAndUpdate(
      { 
        user: req.user._id,
        name: cleanName 
      },
      { 
        $inc: { usageCount: 1 },
        lastUsed: new Date()
      },
      { 
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    );

    console.log('Tag added/updated:', tag);
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error in addTag:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tag already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID format' });
    }

    console.log('Attempting to delete tag:', tagId);

    // Find and delete the tag
    const tag = await Tag.findOneAndDelete({
      _id: tagId,
      user: req.user._id
    });

    if (!tag) {
      console.log('Tag not found:', tagId);
      return res.status(404).json({ error: 'Tag not found' });
    }

    console.log('Tag found and deleted:', tag);

    // Also remove this tag from all expenses
    const updateResult = await Expense.updateMany(
      { user: req.user._id },
      { $pull: { tags: tag.name } }
    );

    console.log('Updated expenses:', updateResult);
    res.json({ 
      message: 'Tag deleted successfully',
      tagName: tag.name,
      expensesUpdated: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error in deleteTag:', error);
    res.status(500).json({ error: error.message });
  }
};