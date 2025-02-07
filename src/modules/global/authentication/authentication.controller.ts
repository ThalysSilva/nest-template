import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { doNothing } from 'src/utils/functions/general';
import { JwtAuthGuard } from 'src/modules/global/authentication/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/modules/global/authentication/guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import { CustomRequest } from 'src/@types/services/types';
import { LoginResponseDto } from './dto/login.dto';
import { ValidateRequest } from 'src/utils/zod/decorators';
import { LoginDto, loginSchema, LoginSchemaData } from './schemas/login';
import { RefreshTokenDto } from './schemas/refresh';

@ApiTags('Autenticação')
@Controller('api/auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ValidateRequest(loginSchema)
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário autenticado com sucesso',
    type: LoginResponseDto,
  })
  @ApiBody({
    description: 'Dados para identificação do usuário',
    type: LoginDto,
  })
  async login(@Request() req, @Body() loginDto: LoginSchemaData) {
    doNothing(loginDto);
    return this.authenticationService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deslogar usuário' })
  @Post('logout')
  async logout(@Request() req: CustomRequest) {
    return this.authenticationService.logout(req.user.id);
  }

  @ApiOperation({ summary: 'Renovar o token de acesso' })
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Token de atualização',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token renovado com sucesso',
    type: LoginResponseDto,
  })
  @Post('refreshToken')
  async renovarToken(@Body('refreshToken') refreshToken: string) {
    return this.authenticationService.refreshToken(refreshToken);
  }
}
