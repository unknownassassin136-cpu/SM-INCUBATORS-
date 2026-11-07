import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Protected image upload to Firebase Storage bucket
router.post('/', authenticateAdmin, upload.single('image'), uploadImage);

export default router;

