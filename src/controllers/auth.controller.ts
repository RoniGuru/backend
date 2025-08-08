import { UserDto } from '../types/user';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const details: UserDto = req.body;
      console.log('logging ins', details);

      const response = await this.authService.login(details);

      if (response.success && response.user) {
        const cookieMaxAge =
          response.user.refresh_token_expiry!.getTime() - Date.now();
        res.cookie('refresh_token', response.user.refresh_token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: cookieMaxAge,
        });

        const accessToken = this.authService.generateAccessToken({
          name: response.user.name,
          id: response.user.id,
        });

        const userData = {
          id: response.user.id,
          name: response.user.name,
          high_score: response.user.high_score,
          created_at: response.user.created_at,
        };

        return res.status(200).json({ user: userData, accessToken });
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
    const details: UserDto = req.body;
    const result = await this.authService.register(details);
    console.log('result', result);
    if (result.success) {
      return res.status(200).json();
    } else {
      return res.status(400).json(result.error);
    }
  };

  token = async (req: Request, res: Response) => {
    if (req.cookies.refresh_token == null) {
      return res.status(401).json({ error: 'no refresh token' });
    }
    const user = await this.authService.findUser(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.cookies.refreshToken != user.refresh_token) {
      return res.status(401).json({ error: 'refresh token  not similar' });
    }

    const newToken = this.authService.generateAccessToken({
      name: user.name,
      id: user.id,
    });

    return res.status(200).json({
      message: 'Token refreshed',
      token: newToken,
    });
  };

  logout = async (req: Request, res: Response) => {
    const user = await this.authService.findUser(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const result = await this.authService.clearRefresh(user.id);
    if (result) {
      return res.status(200).json({ message: 'user logged out' });
    } else {
      return res.status(500).json({ message: 'user not logged out' });
    }
  };
}
