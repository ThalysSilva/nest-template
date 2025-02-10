import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/repository/userRepository';
import { AuthenticationService } from './authentication.service';
import { NotAuthorizedError } from '@/common/applicationError';
import refreshJwtConfig from '@/modules/global/authentication/config/refresh-jwt.config';
import { User } from '@/@entities/user';
import { JwtPayload } from '@/@types/jwt';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('refreshToken', () => {
    it('should return new tokens for a valid refresh token', async () => {
      const refreshToken = 'validRefreshToken';
      const payload: JwtPayload = {
        userId: '123',
        email: 'user@email.com',
        exp: 1234567890,
        iat: 1234567890,
      };
      const user: User = {
        id: '123',
        refreshToken,
        email: '',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('newToken')
        .mockReturnValueOnce('newRefreshToken');
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({
        data: expect.any(Object),
        token: 'newToken',
        refreshToken: 'newRefreshToken',
      });
    });

    it('should throw NotAuthorizedError if user is not found', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = { userId: '123' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        NotAuthorizedError,
      );
    });

    it('should throw NotAuthorizedError if refresh token does not match', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = { userId: '123' };
      const user: User = {
        id: '123',
        refreshToken: 'differentRefreshToken',
        email: 'user@email.com',
        name: 'User Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        NotAuthorizedError,
      );
    });

    it('should throw NotAuthorizedError if refresh token is invalid', async () => {
      const refreshToken = 'invalidRefreshToken';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new NotAuthorizedError({
          action: 'authenticationService.verifyRefreshToken',
          message: 'Token expirado ou inválido',
        });
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        NotAuthorizedError,
      );
    });
  });
});
