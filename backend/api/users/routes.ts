import { Router } from 'express';
import { UserController } from './controllers';
import { registerValidator, loginValidator } from './validators';
import { validate } from './middlewares';

const userRouter = Router();

userRouter.post(
  '/register',
  registerValidator,
  validate,
  UserController.register.bind(UserController),
);

userRouter.post('/login', loginValidator, validate, UserController.login.bind(UserController));

export default userRouter;
