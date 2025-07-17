import { CreateUserDto, LoginDto } from '../types/user';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const details: LoginDto = req.body;
      console.log('logging ins', details);

      const response = await this.authService.login(details);

      if (response.success) {
        return res.status(200).json(response.user);
      } else {
        return res.status(400).json(response.error);
      }
    } catch (error) {
      console.error('Login controller error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  };

  register = async (req: Request, res: Response) => {
    const details: CreateUserDto = req.body;
    console.log('register', details);
    const response = await this.authService.register(details);

    if (response.success) {
      return res.status(200);
    } else {
      return res.status(400).json(response.error);
    }
  };
}
