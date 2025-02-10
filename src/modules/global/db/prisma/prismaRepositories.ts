import { Provider } from '@nestjs/common';
import { UserRepository } from '@/repository/userRepository';
import { PrismaUserRepository } from './repositories/prismaUserRepository';

export const prismaRepositories = [
  {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  },
] as Provider[];
