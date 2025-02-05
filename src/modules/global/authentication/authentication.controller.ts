import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { doNothing } from 'src/utils/functions/general';
import { JwtAuthGuard } from 'src/modules/global/authentication/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/modules/global/authentication/guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import { CustomRequest } from 'src/@types/services/types';
import { LoginDto } from './dto/login.dto';

@ApiTags('Autenticação')
@Controller('api/auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    doNothing(loginDto);
    return this.authenticationService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req: CustomRequest) {
    return this.authenticationService.logout(req.user.id);
  }

  @ApiOperation({ summary: 'Renovar o token de acesso' })
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  async renovarToken(@Body('refreshToken') refreshToken: string) {
    return this.authenticationService.refreshToken(refreshToken);
  }
}
