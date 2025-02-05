import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/repository/userRepository';
import { doNothing } from 'src/utils/functions/general';
import {
  ApplicationError,
  NotAuthorizedError,
} from 'src/common/applicationError';
import { User } from 'src/@types/entities/user';
import { JwtPayload } from 'src/@types/entities/jwt';
import refreshJwtConfig from 'src/modules/global/authentication/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const userWithPassword = await this.userRepository.findByIdWithPassword(
      user.id,
    );

    if (!userWithPassword) {
      throw new NotAuthorizedError({
        action: 'authenticationService.validateUser',
        message: 'Usuário não encontrado',
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      userWithPassword.password,
    );

    if (!passwordValid) return null;

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      userId: user.id,
    };

    const { token, refreshToken } = await this.generateTokens(payload);

    return {
      data: user,
      refreshToken,
      token,
    };
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null });

    return;
  }

  async refreshToken(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotAuthorizedError({
        action: 'authenticationService.RenewToken',
        message: 'Usuário Não encontrado',
      });
    }

    if (refreshToken !== user.refreshToken) {
      throw new NotAuthorizedError({
        action: 'authenticationService.RenewToken',
        message: 'Token de renovação inválido ou expirado',
      });
    }

    const tokens = await this.generateTokens(payload);

    return { data: user, ...tokens };
  }

  private async generateTokens({ exp, iat, ...payload }: JwtPayload) {
    doNothing([exp, iat]);
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    await this.userRepository.update(payload.userId, { refreshToken });

    return { token, refreshToken };
  }

  private verifyRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(
        token,
        this.refreshTokenConfig,
      );
      return payload;
    } catch (erro) {
      if (erro instanceof ApplicationError) throw erro;
      throw new NotAuthorizedError({
        action: 'authenticationService.verifyRefreshToken',
        message: 'Token expirado ou inválido',
      });
    }
  }
}
