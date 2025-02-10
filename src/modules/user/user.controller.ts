import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/@entities/user';
import {
  CreateUserDto,
  createUserSchema,
  CreateUserSchemaData,
} from './schemas/createUser';
import { ValidateRequest } from '@/utils/zod/decorators';
import { ApiResponse, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('Usuários')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ValidateRequest(createUserSchema)
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({
    description: 'Dados para criação do usuário',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos campos enviados',
  })
  public async createUser(
    @Body() user: CreateUserSchemaData,
  ): Promise<User | null> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    return await this.userService.create({ ...user, password: passwordHash });
  }
}
