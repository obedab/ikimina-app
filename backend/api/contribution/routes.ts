import { Router } from 'express';
import { ContributionController } from './controllers';
import { createContributionValidator } from './validators'; 
import { validate } from './middlewares';

const contributionRouter = Router();

contributionRouter.post(
  '/',
  createContributionValidator,
  validate,
  ContributionController.create
);

contributionRouter.get(
  '/',
  ContributionController.fetchContribution
);

contributionRouter.get(
  '/:id',
  ContributionController.getContributionDetails
);

contributionRouter.get(
  '/summary',
  ContributionController.getContributionSummary
);

export default contributionRouter;
