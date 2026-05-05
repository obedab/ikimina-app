import { Request, Response } from 'express';
import { ContributionService } from './services';
import { CurrencyService } from '../currencies/services';
import { Contribution,CreateContributionDTO, ContributionSummary } from '../types/contribution';
import { CurrencyApiResponse } from '../types/currency';
import { sendSuccess, sendError } from '../../utils/response';

const contributionService = new ContributionService();

const currencyService: CurrencyService = new CurrencyService();

export class ContributionController {
  static async create(req: Request, res: Response) {
    try {
      const { amount, currency,type,description, userId } =req.body as Contribution;

      if (!userId) {
        return sendError(res, 'Amount must be greater than 0', 400);
      }

      if (!amount || amount <= 0){
        return sendError(res, 'amount must be greater than 0', 400);
      }
      
      const baseCurrency = await currencyService.findOne({ is_base: true }) ;
      if (!baseCurrency){
        return sendError(res, 'Base currency not set', 500);
      }
      const response =await fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json');

      const data = await response.json() as CurrencyApiResponse;
      const rates = data.eur;

      const from = currency.toLowerCase();
      const base = baseCurrency.code.toLowerCase();

      if (!rates[from] || ! rates[base]) {
        return sendError(res, 'Currency not supported', 400);
      }

      const convertedAmount = amount * (rates[from]/ rates[base]);

    

      const contribution = await contributionService.createContribution({ userId,
      amount: convertedAmount,
      originalAmount: amount,
      originalCurrency: currency,
      type,
      description,} as CreateContributionDTO) ;
      return sendSuccess<Contribution>(res, 'Contribution created successfully', contribution, 201);
    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 400);
    }
  }

  static async fetchContribution(req: Request, res: Response) {
    try {  
      const filters: Partial<Contribution> = {};

      if (req.query.userId) {
        filters.userId = Number(req.query.userId as string);
      }

      if (req.query.type) {
        filters.type = req.query.type as string;
      }

      const contributions = await contributionService.fetchContributions(filters);

      return sendSuccess<Contribution[]>(
        res,
        'Contributions fetched successfully',
        contributions,
        200,
      );
    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 500);
    }
  }

  static async getContributionDetails(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const contribution = await contributionService.getContributionDetails(id);

      return sendSuccess<Contribution>(
        res,
        'Contribution details fetched successfully',
        contribution,
        200,
      );
    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 404);
    }
  }

  static async getContributionSummary(_req: Request, res: Response) {
    try { 
      const total = await contributionService.getContributionSummary();

      return sendSuccess<ContributionSummary>(
        res,
        'Total contributions fetched successfully',
        total,
        200,
      );
    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 500);
    }
  }
}
