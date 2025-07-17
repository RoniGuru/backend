import { CreateUserDto, LoginDto } from '../types/user';
import { UserRepository } from '../repository/user.respository';
import { AuthResponse } from '../types/response';

export class AuthService {
  constructor(private UserRepository: UserRepository) {}

  async login(loginDetails: LoginDto) {
    try {
      const existingUser = await this.UserRepository.findByName(
        loginDetails.name
      );
      if (!existingUser) {
        return {
          success: false,
          error: 'Details invalid',
        };
      }

      if (existingUser.password == loginDetails.password) {
        return {
          success: true,
          user: { id: existingUser.id, name: existingUser.name },
        };
      } else {
        return {
          success: false,
          error: 'Details invalid',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  async register(registerDetails: CreateUserDto): Promise<AuthResponse> {
    try {
      const existingUser = await this.UserRepository.findByName(
        registerDetails.name
      );
      if (existingUser) {
        return {
          success: false,
          error: 'User already exists with this name',
        };
      }
      const user = await this.UserRepository.create({
        name: registerDetails.name,
        password: registerDetails.password,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }
}
