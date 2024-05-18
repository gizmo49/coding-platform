import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response/response.dto';

interface SwaggerOptions<T> {
  description: string;
  model: T;
}

export const ApiDefaultResponse = <TModel extends Type<any>>(
  swaggerOptions: SwaggerOptions<TModel>,
) => {
  const { description, model } = swaggerOptions;
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              message: {
                type: 'string',
              },
              data: {
                type: 'object',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
