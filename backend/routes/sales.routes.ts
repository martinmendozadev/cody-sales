import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';

const router = Router();

router.post('/ventas', SalesController.registerSale);
router.get('/progreso/:userId', SalesController.getProgress);
router.get('/ventas/:userId', SalesController.getSalesHistory);

export default router;
