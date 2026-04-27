import { Request, Response, NextFunction } from 'express';
import { SalesService } from '../services/sales.service';

export class SalesController {

  static async registerSale(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, amount } = req.body;
      if (!userId || typeof amount !== 'number' || amount <= 0) {
        throw { statusCode: 400, message: 'Datos inválidos. userId y amount son requeridos.' };
      }

      const result = await SalesService.registerSale(userId as string, amount);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const result = await SalesService.getProgress(userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const result = await SalesService.getSalesHistory(userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
