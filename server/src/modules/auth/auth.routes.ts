import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/admin-login', authLimiter, AuthController.adminLogin);
router.post('/resident-login', authLimiter, AuthController.residentLogin);
router.post('/demo-login', AuthController.demoLogin);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.put('/profile', authenticate, AuthController.updateProfile);

export default router;

