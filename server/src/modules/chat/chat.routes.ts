import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/conversations', ChatController.getConversations);
router.get('/messages/:contactId', ChatController.getMessages);
router.post('/messages', ChatController.sendMessage);

export default router;
