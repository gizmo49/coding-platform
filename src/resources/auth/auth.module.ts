import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('JWT_SECRET'),
          publicKey: configService.get('JWT_PUBLIC'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_TOKEN_EXPIRES'),
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
