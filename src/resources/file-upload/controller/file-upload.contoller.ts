import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiProtectedHeaders } from '../../../common/decorators/api-headers';
import { FileUploadService } from '../file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../util/file-upload.utils';
import { ResponseDto } from '../../../common/dtos/response/response.dto';
import { ApiMessageResponse } from '../../../common/decorators/api-message';

@ApiProtectedHeaders('File Upload')
@Controller('api/v1')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('/file-upload')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
    }),
  )
  @ApiMessageResponse({
    description: 'Upload image to s3',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file): Promise<ResponseDto<string>> {
    const data = await this.fileUploadService.uploadFile(file);
    return { message: 'File upload successful', data };
  }
}
