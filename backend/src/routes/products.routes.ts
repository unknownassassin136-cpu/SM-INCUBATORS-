import { Router } from 'express';
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsCSV,
  downloadProductsTemplateCSV,
  bulkUploadProducts,
} from '../controllers/products.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// CSV Export and Template (placed before /:slug)
router.get('/export/csv', exportProductsCSV);
router.get('/template/csv', downloadProductsTemplateCSV);

// CSV Bulk Upload (supports dry_run, upsert, insert_only, update_only)
router.post(
  '/bulk/upload',
  authenticateAdmin,
  upload.single('file'),
  bulkUploadProducts
);

// Public product retrieval
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Protected Admin CRUD
router.post('/', authenticateAdmin, createProduct);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;
