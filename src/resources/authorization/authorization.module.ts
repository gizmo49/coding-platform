import { Module } from '@nestjs/common';
import { AuthorizationService } from './services/authorization.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('JWT_SECRET'),
          publicKey: configService.get('JWT_PUBLIC'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_TOKEN_EXPIRES'),
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
