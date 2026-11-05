import { Response } from 'express';
import { ChatService } from './chat.service';
import { AuthRequest } from '../../middleware/auth';

export class ChatController {
  static async getConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const convs = await ChatService.getConversations(req.user._id.toString());
      res.json({ success: true, data: convs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const { contactId } = req.params;
      const { productId } = req.query;
      const messages = await ChatService.getMessages(
        req.user._id.toString(),
        contactId as string,
        productId as string
      );
      res.json({ success: true, data: messages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const { recipientId, text, productId, orderId, isQuickReply } = req.body;
      const message = await ChatService.sendMessage({
        senderId: req.user._id.toString(),
        recipientId,
        text,
        productId,
        orderId,
        isQuickReply
      });
      res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
