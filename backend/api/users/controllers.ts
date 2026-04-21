import { Request, Response } from 'express';
import { UserService } from './services';
import { User } from '../types/user';
import { sendError, sendSuccess } from '../../utils/response';

const userService = new UserService();
export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body as User);

      return sendSuccess<User>(res, 'User registered successfully', user, 201);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      return sendError(res, errorMessage, 400);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as User;
      const result = await userService.loginUser(email, password);

      return sendSuccess(res, 'Login successful', {
        user: result.user,
        token:result.token,
        }, 200);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      return sendError(res, errorMessage, 401);
    }
  }
}
