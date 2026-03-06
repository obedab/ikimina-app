import { Request, Response } from "express";
import { UserService } from "./services";

const userService = new UserService();
export class UserController {
  static async register(req: Request, res: Response){
    try{
      const user = await userService.create(req.body);

      res.status(201).json({
        message:'User registered successfully',
        data: user,
      });
    }catch(error:any) {
      res.status(400).json({
        message: error.message,
      });
    }

  }
  static async login(req: Request, res: Response){
    try {
      const { email, password } = req.body;
      const user = await userService.loginUser(email, password);

      res.status(200).json({
        message:'Login successful',
        data: user,
      });
    } catch(error:any) {
      res.status(401).json({
        message: error.message,
      });
    }
  }
  
}
