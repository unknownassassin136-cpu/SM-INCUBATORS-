import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orders.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public: customer inquiry submission from checkout modal
router.post('/', createOrder);

// Protected Admin: view and update orders
router.get('/', authenticateAdmin, getAllOrders);
router.patch('/:id/status', authenticateAdmin, updateOrderStatus);

export default router;

