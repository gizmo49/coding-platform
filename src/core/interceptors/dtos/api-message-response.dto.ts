import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../../common/dtos/response.dto';

interface SwaggerOptions {
  description: string;
}

export const ApiMessageResponseDto = (swaggerOptions: SwaggerOptions) => {
  const { description } = swaggerOptions;
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              message: {
                type: 'string',
              },
              data: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
  );
};
