import express from 'express';
import { getCategories, addCategory, deleteCategory } from '../controllers/category.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCategories);
router.post('/', auth, addCategory);
router.patch('/:id', auth, async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.delete('/:id', auth, deleteCategory);

export default router;