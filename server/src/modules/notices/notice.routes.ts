import { Router } from 'express';
import { NoticeController } from './notice.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', NoticeController.list);
router.post('/', authenticate, NoticeController.create);
router.patch('/:id/resolve', authenticate, NoticeController.toggleResolve);

export default router;
