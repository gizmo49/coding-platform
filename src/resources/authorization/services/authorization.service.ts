import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../interface/user-payload.dto';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(private readonly jwtService: JwtService) {}

  encryptUserPayload(userPayload: UserPayload) {
    return this.jwtService.sign(userPayload);
  }

  extractUserPayload(user, workspaceId: string): UserPayload {
    return {
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      workspaceId,
      userImage: user.image || null,
      permissions: [],
    };
  }

  decryptUserPayload(token: string): UserPayload {
    try {
      return this.jwtService.verify(token, {
        algorithms: ['RS256'],
        secret: process.env['JWT_SECRET'],
        ignoreExpiration: false,
      });
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid Token');
    }
  }
}
