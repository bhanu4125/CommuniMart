import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../middleware/auth';
import { authorizeRoles } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('committee_admin'));

router.get('/stats', AdminController.getStats);
router.get('/residents', AdminController.getResidents);
router.patch('/residents/:id', AdminController.updateResident);

export default router;
