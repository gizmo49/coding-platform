import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

export function ApiHeaders(tags) {
  return applyDecorators(
    ApiTags(tags),
    ApiHeader({
      name: 'x-request-client-key',
      description: 'API Key',
      required: true,
    }),
  );
}

export function ApiProtectedHeaders(tags) {
  return applyDecorators(
    ApiTags(tags),
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-request-client-key',
      description: 'API Key',
      required: true,
    }),
  );
}
