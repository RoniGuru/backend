import { CreateUserDto, LoginDto, User } from '../model/user';
import { Request, Response } from 'express';

export class AuthController {
  private fake: User[] = [{ name: 'test', password: 'test' }];

  login = async (req: Request, res: Response) => {
    const details: LoginDto = req.body;
    console.log('logging in', details);

    try {
      const user = this.fake.find((u) => u.name === details.name);
      if (!user) {
        console.log('invalid');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({ message: 'logged in' });
    } catch {
      res.status(500).json({ error: 'failed to login user' });
    }
  };

  register = async (req: Request, res: Response) => {
    const details: CreateUserDto = req.body;
    try {
      this.fake.push(details);
      res.status(200).json({ message: 'user registered' });
    } catch {
      res.status(500).json({ error: 'failed to register user' });
    }
  };
}
