import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';


@Injectable()
export class WSAuthService {
  constructor(private configService: ConfigService) {}

  isValidAuthHeader(authorization: string) {
    const token: string = authorization.split(' ')[1];
    const payload = verify(token, this.configService.get('JWT_SECRET'), {
      ignoreExpiration: true,
    });
    return payload;
  }
}