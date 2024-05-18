import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response/response.dto';

interface SwaggerOptions {
  description: string;
}

export const ApiMessageResponse = (swaggerOptions: SwaggerOptions) => {
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
