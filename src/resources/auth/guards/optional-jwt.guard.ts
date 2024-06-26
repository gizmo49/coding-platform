import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { authorization }: any = request.headers;

        if (authorization) {
            const authToken = authorization.split(' ')[1];
            if (authToken) {
                try {
                    const resp = await this.authService.validateToken(authToken);
                    request.user = resp; // Attach user details to the request
                    return true; // Authorization successful
                } catch (error) {
                    console.log('Authentication error:', error.message);
                }
            }
        }

        // If no authorization header or token provided, continue without authenticating
        return true;
    }
}
