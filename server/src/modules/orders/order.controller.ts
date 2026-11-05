import { Response } from 'express';
import { OrderService } from './order.service';
import { AuthRequest } from '../../middleware/auth';

export class OrderController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const order = await OrderService.createOrder({
        ...req.body,
        buyerId: req.user._id.toString()
      });
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const orders = await OrderService.getMyOrders(req.user._id.toString());
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const order = await OrderService.getOrderById(
        req.user._id.toString(),
        req.params.id as string,
        req.user.role
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const { status, note } = req.body;
      const order = await OrderService.updateOrderStatus(
        req.user._id.toString(),
        req.params.id as string,
        status,
        note,
        req.user.role
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async confirmPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const order = await OrderService.markPaymentPaid(
        req.user._id.toString(),
        req.params.id as string,
        req.body.upiReference
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async submitReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const { rating, comment, badgesAwarded } = req.body;
      const order = await OrderService.addReview(
        req.user._id.toString(),
        req.params.id as string,
        Number(rating),
        comment,
        badgesAwarded || []
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
