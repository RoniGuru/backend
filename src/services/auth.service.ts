import { CreateUserDto, LoginDto } from '../types/user';
import { UserRepository } from '../repository/user.respository';
import { AuthResponse } from '../types/response';
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async hashPassword(password: string): Promise<string> {
    if (!process.env.SALT) {
      throw new Error('SALT environment variable is not defined');
    }
    const salt = Number(process.env.SALT);
    return await bcrypt.hash(password, salt);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async login(loginDetails: LoginDto) {
    try {
      const existingUser = await this.userRepository.findByName(
        loginDetails.name
      );
      if (!existingUser) {
        return {
          success: false,
          error: 'Details invalid',
        };
      }

      const compare = await this.verifyPassword(
        loginDetails.password,
        existingUser.password
      );

      if (compare) {
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
      const existingUser = await this.userRepository.findByName(
        registerDetails.name
      );
      if (existingUser) {
        return {
          success: false,
          error: 'User already exists with this name',
        };
      }
      const hashedPassword = await this.hashPassword(registerDetails.password);
      await this.userRepository.create({
        name: registerDetails.name,
        password: hashedPassword,
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
