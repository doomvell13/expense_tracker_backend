import express from 'express';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCategories);
router.post('/', auth, addCategory);
router.patch('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;