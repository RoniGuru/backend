import { UserService } from '../services/user.service';
import { UpdateUserDto, UserDto } from '../types/user';
import { Request, Response } from 'express';

export class UserController {
  constructor(private userService: UserService) {}

  get = async (req: Request, res: Response) => {
    try {
      const details: UpdateUserDto = req.body;
      const response = await this.userService.getUser(details.id);
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
      const details: UpdateUserDto = req.body;
      const response = await this.userService.getUser(details.id);
      //if user found
      if (response) {
        const update = await this.userService.updateUser(details.id, {
          name: details.name,
          password: details.password,
        });
        //if update didnt work
        if (!update) {
          return res.status(404).json({ error: 'unable to update user' });
        }
        return res.status(200).json({
          user: {
            id: update.id,
            name: update.name,
            created_at: update.created_at,
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
}
