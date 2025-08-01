import { UserRepository } from '../repository/user.respository';
import { UserDto, userData } from '../types/user';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: number): Promise<userData | null> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        created_at: user.created_at,
        high_score: user.high_score,
      };
      return userData;
    } else {
      return null;
    }
  }

  async updateUser(id: number, userData: Partial<UserDto>) {
    return this.userRepository.update(id, userData);
  }

  async getLeaderBoard() {
    return this.userRepository.leaderBoard();
  }
}
