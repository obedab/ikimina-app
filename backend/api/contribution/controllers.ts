import { Request, Response } from 'express';
import { ContributionService } from './services';
import { Contribution } from '../types/contribution';
import { sendSuccess, sendError } from '../../utils/response';

const contributionService = new ContributionService();

export class ContributionController {

  static async create(req: Request, res: Response) {
    try {
      const contribution = await contributionService.createContribution(
        req.body as Contribution
      );

      return sendSuccess<Contribution>(
        res,
        'Contribution created successfully',
        contribution,
        201
      );

    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 400);
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const contributions =
        await contributionService.getAllContributions();

      return sendSuccess<Contribution[]>(
        res,
        'Contributions fetched successfully',
        contributions,
        200
      );

    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 500);
    }
  }

  static async getByCondition(req: Request, res: Response) {
    try {
      const condition: Partial<Contribution> = {};

      if (req.query.userId) {
        condition.userId = Number(req.query.userId as string);
      }

      if (req.query.type) {
        condition.type = req.query.type as string;
      }

      const contributions =
        await contributionService.getContributionsByConditions(condition);

      return sendSuccess<Contribution[]>(
        res,
        'Filtered contributions fetched successfully',
        contributions,
        200
      );

    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 500);
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const contribution =
        await contributionService.getContributionDetails(id);

      return sendSuccess<Contribution>(
        res,
        'Contribution details fetched successfully',
        contribution,
        200
      );

    } catch (error: unknown) {
      return sendError(res, (error as Error).message, 404);
    }
  }
}
