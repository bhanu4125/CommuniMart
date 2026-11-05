import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', OrderController.create);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getById);
router.patch('/:id/status', OrderController.updateStatus);
router.patch('/:id/pay', OrderController.confirmPayment);
router.post('/:id/review', OrderController.submitReview);

export default router;

