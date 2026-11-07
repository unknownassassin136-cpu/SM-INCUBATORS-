import { Router } from 'express';
import { getContent, updateContent } from '../controllers/content.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public read
router.get('/:key', getContent);

// Protected Admin update
router.put('/:key', authenticateAdmin, updateContent);

export default router;

