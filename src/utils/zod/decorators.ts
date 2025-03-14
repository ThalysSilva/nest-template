import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod';
import { ZodTypeAny } from 'zod';

export function ValidateRequest(schema: ZodTypeAny) {
  return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
