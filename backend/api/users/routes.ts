import { Router } from 'express';
import { UserController } from './controllers';
import { registerValidator, loginValidator } from './validators';
import { validate } from './middlewares';

const router = Router();

router.post('/register', registerValidator, validate, (req:any, res: any) => UserController.register(req, res));

router.post(
  '/login',
  loginValidator,
  validate,
  (req: any, res: any) => UserController.login(req, res)
);

export default router;
