import { Request, Response } from 'express';
import { ContributionService } from './services';
import { Contribution, ContributionSummary } from '../types/contribution';
import { sendSuccess, sendError } from '../../utils/response';

const contributionService = new ContributionService();

export class ContributionController {
  static async create(req: Request, res: Response) {
    try {
      const contribution = await contributionService.createContribution(req.body as Contribution);

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
