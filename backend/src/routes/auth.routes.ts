import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/verify', authenticateAdmin, verifyToken);

export default router;

