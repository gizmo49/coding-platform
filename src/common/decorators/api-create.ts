import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response/response.dto';

interface SwaggerOptions<T> {
  description: string;
  model?: T;
}

export const ApiCreateResponse = <TModel extends Type<any>>(
  swaggerOptions: SwaggerOptions<TModel>,
) => {
  const { description, model } = swaggerOptions;
  return applyDecorators(
    ApiCreatedResponse({
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
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
    }),
  );
};
