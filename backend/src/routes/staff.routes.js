import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { listStaff, createStaff, updateStaff } from '../controllers/staffController.js';

const router = Router();
router.use(authenticate, authorize('ADMIN'));
router.get('/', listStaff);
router.post('/', createStaff);
router.patch('/:id', updateStaff);
export default router;
