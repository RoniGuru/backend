import { CreateUserDto, LoginDto } from '../types/user';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private AuthService: AuthService) {}

  async login(req: Request, res: Response) {
    const details: LoginDto = req.body;
    console.log('logging in', details);
    const response = await this.AuthService.login(details);

    if (response.success) {
      return res.status(200).json(response.user);
    } else {
      return res.status(400).json(response.error);
    }
  }

  register = async (req: Request, res: Response) => {
    const details: CreateUserDto = req.body;
    console.log('logging in', details);
    const response = await this.AuthService.register(details);

    if (response.success) {
      return res.status(200);
    } else {
      return res.status(400).json(response.error);
    }
  };
}
