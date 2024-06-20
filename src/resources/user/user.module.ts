import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository
    ]),
    FileUploadModule,
  ],
  providers: [
    UserService
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule { }
