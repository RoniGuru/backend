import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../types/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export class UserController {
  constructor(private userService: UserService) {}

  get = async (req: Request, res: Response) => {
    try {
      const response = await this.userService.getUser(Number(req.params.id));
      //if user found
      if (response) {
        return res.status(200).json({
          userData: response,
        });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (error) {
      console.error('User controller get error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const details: Partial<UpdateUserDto> = req.body;
      const id = Number(req.params.id);
      const response = await this.userService.getUser(id);
      //if user found
      if (response && response.password && details.password) {
        //password compare
        const compare = await bcrypt.compare(
          details.password,
          response.password
        );
        if (!compare) {
          return res
            .status(400)
            .json({ error: 'unable to update user invalid password' });
        }

        const update = await this.userService.updateUser(id, details);
        //if update didnt work
        if (!update) {
          return res.status(404).json({ error: 'unable to update user' });
        }
        return res.status(200).json({
          user: {
            id: update.id,
            name: update.name,
            created_at: update.created_at,
            high_score: update.high_score,
          },
        });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (error) {
      console.error('User controller get error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  };

  getLeaderboard = async (req: Request, res: Response) => {
    try {
      const response = await this.userService.getLeaderBoard();
      //if user found
      if (response) {
        return res.status(200).json({ leaderboard: response });
      }
      return res.status(404).json({ error: 'leaderboard empty' });
    } catch (error) {
      console.error('User controller leaderboard error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  };
}
