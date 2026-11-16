import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { reservationSchema } from '../validators/schemas.js';
import { createReservation, listReservations, updateReservation } from '../controllers/reservationController.js';

const router = Router();
router.post('/', authenticate, authorize('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMIN'), validate(reservationSchema), createReservation);
router.get('/', authenticate, authorize('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMIN'), listReservations);
router.patch('/:id', authenticate, authorize('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMIN'), updateReservation);
export default router;
