import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { AuthRequest } from '../../middleware/auth';

export class ProductController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.listProducts(req.query as any);
      res.json({ success: true, count: products.length, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id as string);
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const product = await ProductService.createProduct(req.user._id.toString(), req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const updated = await ProductService.updateProduct(
        req.user._id.toString(),
        req.params.id as string,
        req.body,
        req.user.role
      );
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      await ProductService.deleteProduct(
        req.user._id.toString(),
        req.params.id as string,
        req.user.role
      );
      res.json({ success: true, message: 'Product listing removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async toggleAvailability(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      const product = await ProductService.toggleAvailability(
        req.user._id.toString(),
        req.params.id as string
      );
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
