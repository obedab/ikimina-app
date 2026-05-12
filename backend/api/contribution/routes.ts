import { Router } from 'express';
import { ContributionController } from './controllers';
import { createContributionValidator } from './validators';
import { authenticate, validate } from './middlewares';

const contributionRouter = Router();

contributionRouter.post(
  '/',
  authenticate,
  createContributionValidator,
  validate,
  ContributionController.create,
);

contributionRouter.get('/', ContributionController.fetchContribution);

contributionRouter.get('/:id', ContributionController.getContributionDetails);

contributionRouter.get('/summary', authenticate, ContributionController.getContributionSummary);

export default contributionRouter;
