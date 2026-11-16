import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { orderSchema } from '../validators/schemas.js';
import { createOrder, listOrders, updateOrderStatus, registerPayment } from '../controllers/orderController.js';

const router = Router();
router.post('/', authenticate, authorize('CLIENTE', 'GARCOM', 'ATENDENTE', 'GERENTE', 'ADMIN'), validate(orderSchema), createOrder);
router.get('/', authenticate, authorize('CLIENTE', 'COZINHEIRO', 'GARCOM', 'ATENDENTE', 'CAIXA', 'GERENTE', 'ADMIN'), listOrders);
router.patch('/:id/status', authenticate, authorize('COZINHEIRO', 'GARCOM', 'ATENDENTE', 'GERENTE', 'ADMIN'), updateOrderStatus);
router.patch('/:id/payment', authenticate, authorize('CAIXA', 'ATENDENTE', 'GERENTE', 'ADMIN'), registerPayment);

export default router;
