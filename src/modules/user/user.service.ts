import { Injectable } from '@nestjs/common';
import { UserWithPassword } from '@/@entities/user';
import { BadRequestError } from '@/common/applicationError';
import { UserRepository } from '@/repository/userRepository';
import { OmitDefaultData } from '@/utils/types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: Omit<OmitDefaultData<UserWithPassword>, 'refreshToken'>) {
    const emailExists = await this.userRepository.findByEmail(user.email);
    if (emailExists) {
      throw new BadRequestError({
        message: 'Email já está cadastrado',
        action: 'UserService.create',
        saveLog: false,
      });
    }
    return this.userRepository.create(user);
  }
}
