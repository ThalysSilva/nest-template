import { Injectable } from '@nestjs/common';
import { UserWithPassword } from 'src/@types/entities/user';
import { BadRequestError } from 'src/common/applicationError';
import { UserRepository } from 'src/repository/userRepository';
import { OmitDefaultData } from 'src/utils/types';

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
