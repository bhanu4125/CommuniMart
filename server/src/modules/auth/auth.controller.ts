import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);
      res.cookie('token', token, cookieOptions);
      res.status(201).json({ success: true, user, token });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      res.cookie('token', token, cookieOptions);
      res.json({ success: true, user, token });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  static async demoLogin(req: Request, res: Response): Promise<void> {
    try {
      const role = (req.body.role || 'resident') as any;
      const { user, token } = await AuthService.demoLogin(role);
      res.cookie('token', token, cookieOptions);
      res.json({ success: true, user, token });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      res.json({ success: true, user: req.user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const updated = await AuthService.updateProfile(req.user._id.toString(), req.body);
      res.json({ success: true, user: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

