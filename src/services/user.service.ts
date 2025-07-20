import { UserRepository } from '../repository/user.respository';
import { UpdateUserDto, userData } from '../types/user';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: number): Promise<userData | null> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        created_at: user.created_at,
      };
      return userData;
    } else {
      return null;
    }
  }

  async updateUser(id: number, userData: Partial<UpdateUserDto>) {
    return this.userRepository.update(id, userData);
  }
}
