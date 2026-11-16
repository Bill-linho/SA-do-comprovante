import { Router } from 'express';
import { DiningTable } from '../models/index.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const tables = await DiningTable.findAll({ where: { active: true }, order: [['number', 'ASC']] });
    res.json(tables);
  } catch (error) { next(error); }
});
router.post('/', authenticate, authorize('ADMIN', 'GERENTE'), async (req, res, next) => {
  try {
    const table = await DiningTable.create({ number: Number(req.body.number), capacity: Number(req.body.capacity || 4) });
    res.status(201).json(table);
  } catch (error) { next(error); }
});
export default router;
