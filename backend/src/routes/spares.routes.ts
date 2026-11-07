import { Router } from 'express';
import {
  getAllSpares,
  getSpareBySlug,
  createSpare,
  updateSpare,
  deleteSpare,
} from '../controllers/spares.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllSpares);
router.get('/:slug', getSpareBySlug);

// Protected Admin routes
router.post('/', authenticateAdmin, createSpare);
router.put('/:id', authenticateAdmin, updateSpare);
router.delete('/:id', authenticateAdmin, deleteSpare);

export default router;

