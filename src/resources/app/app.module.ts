import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { typeOrmConfigAsync } from '../../config/database/typeorm.config';
import { CodingProblemModule } from '../coding-problem/coding-problem.module';
import { CodingSolutionModule } from '../coding-solution/coding-solution.module';


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
    CodingProblemModule,
    CodingSolutionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
