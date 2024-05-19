import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { typeOrmConfigAsync } from '../../config/database/typeorm.config';
import { TaskModule } from '../task/task.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'test' ? '.env.test' || '.env' : '.env',
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UsersModule,
    TaskModule,
    SocketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
