import { User, UserWithPassword } from 'src/@types/entities/user';
import { UserRepository } from 'src/repository/userRepository';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { OmitDefaultData } from 'src/utils/types';
import _ from 'lodash';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  defineTransactionContext(context: Prisma.TransactionClient): void {
    this.prisma = context as PrismaService;
  }

  removeTransactionContext(): void {
    this.prisma = new PrismaService();
  }

  async create(
    user: Omit<OmitDefaultData<UserWithPassword>, 'refreshToken'>,
  ): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
      },
    });
    return _.omit(newUser, 'password');
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user ? _.omit(user, 'password') : null;
  }

  async findByIdWithPassword(id: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? _.omit(user, 'password') : null;
  }

  async update(
    id: string,
    data: Partial<OmitDefaultData<UserWithPassword>>,
  ): Promise<any> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return _.omit(user, 'password');
  }
}
