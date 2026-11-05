import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.getById);
router.post('/', authenticate, ProductController.create);
router.put('/:id', authenticate, ProductController.update);
router.delete('/:id', authenticate, ProductController.delete);
router.patch('/:id/toggle-availability', authenticate, ProductController.toggleAvailability);

export default router;
