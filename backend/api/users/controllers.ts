import { Request, Response } from 'express';
import { UserService } from './services';
import { User } from '../types/user';

const userService = new UserService();
export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body as User);

      res.status(201).json({
        message: 'User registered successfully',
        data: user,
      });
    } catch (error: unknown) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as User;
      const user = await userService.loginUser(email, password);

      res.status(200).json({
        message: 'Login successful',
        data: user,
      });
    } catch (error: unknown) {
      res.status(401).json({
        message: (error as Error).message,
      });
    }
  }
}
