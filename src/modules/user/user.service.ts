import { Injectable } from '@nestjs/common';
import { UserWithPassword } from '@/@entities/user';
import { BadRequestError } from '@/common/applicationError';
import { UserRepository } from '@/repository/userRepository';
import { OmitDefaultData } from '@/utils/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: Omit<OmitDefaultData<UserWithPassword>, 'refreshToken'>) {
    const password = await bcrypt.hash(user.password, 10);

    const emailExists = await this.userRepository.findByEmail(user.email);
    if (emailExists) {
      throw new BadRequestError({
        message: 'Email já está cadastrado',
        action: 'UserService.create',
        saveLog: false,
      });
    }
    return this.userRepository.create({ ...user, password });
  }
}
