import { Router } from 'express';
import userRouter from './users/routes';
import currencyRouter from './currencies/routes';
import contributionRouter from './contribution/routes';

const router = Router();

router.use('/user', userRouter);
router.use('/contribution', contributionRouter);
router.use('/currency', currencyRouter);

export default router;
