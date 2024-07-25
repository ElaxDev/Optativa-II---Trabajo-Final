import { Router } from 'express';
import {
  getItems,
  updateItems,
  createItem,
  deleteItem,
} from '../controllers/items.controller';
import { protect } from '../libs/authMiddleware';

const router = Router();

router.get('/', protect, getItems);

router.put('/:id', protect, updateItems);

router.post('/', protect, createItem);

router.delete('/:id', protect, deleteItem);

export default router;
