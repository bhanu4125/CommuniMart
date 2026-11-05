import { Response } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../../middleware/auth';

export class AdminController {
  static async getStats(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await AdminService.getCommunityStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getResidents(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const residents = await AdminService.getResidents();
      res.json({ success: true, count: residents.length, data: residents });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateResident(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { verificationStatus, role, badges } = req.body;
      const resident = await AdminService.updateResidentStatus(
        req.params.id as string,
        verificationStatus,
        role,
        badges
      );
      res.json({ success: true, data: resident });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
