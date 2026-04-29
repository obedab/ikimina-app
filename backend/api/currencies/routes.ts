import { Router } from 'express';
import { CurrencyController } from '../currencies/controllers';

const currencyRouter = Router();

currencyRouter.post('/', CurrencyController.createCurrency);

currencyRouter.patch('/:id/base', CurrencyController.enableBaseCurrency);

export default currencyRouter;
