import { Request, Response } from 'express';
import { NoticeService } from './notice.service';
import { AuthRequest } from '../../middleware/auth';

export class NoticeController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const notices = await NoticeService.listNotices(req.query.category as string);
      res.json({ success: true, count: notices.length, data: notices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const notice = await NoticeService.createNotice(req.user._id.toString(), req.body);
      res.status(201).json({ success: true, data: notice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async toggleResolve(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const notice = await NoticeService.toggleResolve(
        req.user._id.toString(),
        req.params.id as string,
        req.user.role
      );
      res.json({ success: true, data: notice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
