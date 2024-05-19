import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiHeaders(tags) {
  return applyDecorators(
    ApiTags(tags),
  );
}

export function ApiProtectedHeaders(tags) {
  return applyDecorators(
    ApiTags(tags),
    ApiBearerAuth(),
  );
}
