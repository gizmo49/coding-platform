import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { typeOrmConfigAsync } from '../../config/database/typeorm.config';
import { JwtGuard } from '../auth/jwt.guard';
import { TaskModule } from '../task/task.module';

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
    TaskModule

  ],
  controllers: [],
  providers: [ {
    provide: APP_GUARD,
    useClass: JwtGuard,
  }
],
})
export class AppModule { }
