import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { NotAuthorizedError } from '@/common/applicationError';
import { AuthenticationService } from '@/modules/global/authentication/authentication.service';
import { User } from '@/@entities/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.authenticationService.validateUser(email, password);
    if (!user) {
      throw new NotAuthorizedError({
        action: 'localStrategy.validate',
        message: 'credênciais inválidas',
      });
    }
    return user;
  }
}
