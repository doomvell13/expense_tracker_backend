import Category from '../models/category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    console.log('Update request:', {
      categoryId: req.params.id,
      userId: req.user._id,
      body: req.body
    });

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { 
        name: req.body.name,
        icon: req.body.icon.toString(),
        user: req.user._id
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    console.log('Updated category:', category);
    res.json(category);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};