import { Request, Response } from 'express';
import { ContributionService } from './services';
import { CurrencyService } from '../currencies/services';
import { Contribution, CreateContributionDTO, ContributionSummary } from '../types/contribution';
import { sendSuccess, sendError } from '../../utils/response';

const contributionService = new ContributionService();

const currencyService: CurrencyService = new CurrencyService();

export class ContributionController {
  static async create(req: Request, res: Response) {
    try {
      const { amount, currency, type, description, userId } = req.body as Contribution;

      if (!userId) {
        return sendError(res, 'userId is required', 400);
      }

      if (!amount || amount <= 0) {
        return sendError(res, 'amount must be greater than 0', 400);
      }

      const baseCurrency = await currencyService.findOne({ is_base: true });
      if (!baseCurrency) {
        return sendError(res, 'Base currency not set', 500);
      }

      const convertedAmount = await currencyService.convertToBaseCurrency({
        amount,
        fromCurrency: currency,
        baseCurrency: baseCurrency.code,
      });

      const payload: CreateContributionDTO = {
        userId,
        amount: convertedAmount,
        originalAmount: amount,
        originalCurrency: currency,
        type,
        description,
      };
      const contribution = await contributionService.createContribution(payload);
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
