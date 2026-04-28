import { Request, Response } from 'express';
import { CurrencyService } from './services';
import { Currency } from '../types/currency';
import { sendError, sendSuccess } from '../../utils/response';

const currencyService = new CurrencyService();
export class CurrencyController {
  static async createCurrency(req: Request, res: Response) {
    try {
      const currency = await currencyService.createCurrency(req.body as Currency);

      return sendSuccess(res, 'Currency created successfully  ', currency, 201);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      return sendError(res, errorMessage, 400);
    }
  }

  static async enableBaseCurrency(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const currency = await currencyService.enableBaseCurrency(id);

      return sendSuccess(res, 'Base currency updated successfully', currency);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      return sendError(res, errorMessage, 400);
    }
  }
}
