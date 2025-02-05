import { Request } from '@nestjs/common';
import { User } from '../entities/user';

export type CustomRequest = typeof Request & {
  user: User;
};
