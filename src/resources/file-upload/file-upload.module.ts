import { Module } from '@nestjs/common';
import { FileUploadController } from './controller/file-upload.contoller';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
