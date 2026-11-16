import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { productSchema } from '../validators/schemas.js';
import { listCategories, listProducts, createCategory, updateCategory, createProduct, updateProduct } from '../controllers/productController.js';

const router = Router();
router.get('/categories', listCategories);
router.post('/categories', authenticate, authorize('ADMIN', 'GERENTE'), createCategory);
router.patch('/categories/:id', authenticate, authorize('ADMIN', 'GERENTE'), updateCategory);
router.get('/products', listProducts);
router.post('/products', authenticate, authorize('ADMIN', 'GERENTE'), validate(productSchema), createProduct);
router.patch('/products/:id', authenticate, authorize('ADMIN', 'GERENTE'), updateProduct);
export default router;
