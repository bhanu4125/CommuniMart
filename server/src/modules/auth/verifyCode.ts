import { Request, Response } from 'express';

const VALID_GATE_CODES = ['GREEN2026', 'MEADOWS2026', 'TOWERA', 'TOWERB'];

export const verifyGateCode = (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || !VALID_GATE_CODES.includes(code.trim().toUpperCase())) {
    res.status(400).json({ success: false, message: 'Invalid society verification pass code' });
    return;
  }
  res.json({ success: true, message: 'Society unit verification approved' });
};
