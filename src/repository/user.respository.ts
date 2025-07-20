import { prisma } from '../lib/prisma';
import { UserDto } from '../types/user';
import { User } from '../generated/prisma';

//handles interaction with database
export class UserRepository {
  private client;
  constructor() {
    this.client = prisma;
  }

  async create(userData: UserDto): Promise<User> {
    return await this.client.user.create({
      data: { ...userData },
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.client.user.findFirst({
      where: { name },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.client.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    return await prisma.user.update({
      where: { id: id },
      data: userData,
    });
  }
}
