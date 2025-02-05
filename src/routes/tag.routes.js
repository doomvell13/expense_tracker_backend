import express from 'express';
import { getTags, addTag, deleteTag } from '../controllers/tag.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTags);
router.post('/', auth, addTag);
router.delete('/:id', auth, deleteTag); 

export default router;