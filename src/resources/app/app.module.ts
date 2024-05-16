import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { SharedModule } from '../shared/shared.module';
import { typeOrmConfigAsync } from '../../config/database/typeorm.config';

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
    AuthorizationModule,
    UsersModule,
    SharedModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
