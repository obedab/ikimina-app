import { Router } from 'express';
import userRouter from './users/routes';
import currencyRouter from './currencies/routes';

const router = Router();

router.use('/user', userRouter);
router.use('/currency', currencyRouter);

export default router;
