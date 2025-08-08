import { UserDto } from '../types/user';
import { UserRepository } from '../repository/user.respository';
import { AuthResponse } from '../types/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  generateAccessToken(userData: { name: string; id: number }) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS TOKEN SECRETe is not defined');
    }
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '2s',
    });
  }

  generateRefreshToken(userData: { name: string; id: number }) {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH TOKEN SECRET variable is not defined');
    }
    return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30 days',
    });
  }

  async hash(value: string): Promise<string> {
    if (!process.env.SALT) {
      throw new Error('SALT environment variable is not defined');
    }
    const salt = Number(process.env.SALT);
    return await bcrypt.hash(value, salt);
  }

  async verifyHash(value: string, hashedValue: string): Promise<Boolean> {
    return await bcrypt.compare(value, hashedValue);
  }

  async login(loginDetails: UserDto) {
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

      const compare = await this.verifyHash(
        loginDetails.password,
        existingUser.password
      );

      if (compare) {
        const refreshToken = this.generateRefreshToken({
          name: existingUser.name,
          id: existingUser.id,
        });
        const update = await this.userRepository.update(existingUser.id, {
          refresh_token: refreshToken,
          refresh_token_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        return {
          success: true,
          user: {
            id: existingUser.id,
            name: existingUser.name,
            high_score: existingUser.high_score,
            refresh_token: refreshToken,
            refresh_token_expiry: update?.refresh_token_expiry,
            created_at: existingUser.created_at,
          },
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

  async register(registerDetails: UserDto): Promise<AuthResponse> {
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

      const hashedPassword = await this.hash(registerDetails.password);

      const result = await this.userRepository.create({
        name: registerDetails.name,
        password: hashedPassword,
      });
      console.log(result);
      if (result) {
        return {
          success: true,
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  async findUser(id: number) {
    return await this.userRepository.findById(id);
  }

  async clearRefresh(id: number) {
    return await this.userRepository.update(id, {
      refresh_token: '',
      refresh_token_expiry: null,
    });
  }
}
