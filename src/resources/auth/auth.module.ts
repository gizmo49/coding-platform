import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from '../user/user.module';
import { WSAuthService } from './service/ws-auth.service';


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
            // algorithm: 'RS256',
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
    WSAuthService,
    JwtStrategy
  ],
  exports: [JwtStrategy, PassportModule, AuthService, WSAuthService],
})
export class AuthModule { }
