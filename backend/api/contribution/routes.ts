import { Router } from 'express';
import { ContributionController } from './controllers';
import { createContributionValidator } from './validators'; 
import { validate } from './middlewares';

const contributionRouter = Router();

contributionRouter.post(
  '/register',
  createContributionValidator,
  validate,
  ContributionController.create.bind(ContributionController)
);

contributionRouter.get(
  '/',
  ContributionController.getAll.bind(ContributionController)
);

contributionRouter.get(
  '/filter',
  ContributionController.getByCondition.bind(ContributionController)
);

contributionRouter.get(
  '/:id',
  ContributionController.getOne.bind(ContributionController)
);


contributionRouter.get(
  '/total',
  ContributionController.getTotal.bind(ContributionController)
);

export default contributionRouter;
