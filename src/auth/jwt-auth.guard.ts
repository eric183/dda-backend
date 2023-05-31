import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    // Add your custom authentication logic here

    // for example, call super.logIn(request) to establish a session.
    const result = super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.replace('Bearer', '').trim();
    // if (!this.authService?.verifyToken) {
    //   return false;
    // }

    // console.log(request.url, await result, '....');

    if (token !== 'null') {
      const user = await this.authService?.verifyToken(
        request.headers.authorization,
      );

      if (result && user && user.verified) {
        return result;
      }

      if (user && !user.verified) {
        throw new BadRequestException(
          'Please check your inbox to verify email',
          {
            cause: new Error(),
            description: 'Please check your inbox to verify email',
          },
        );
      }

      return result;
    }

    return result;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  // async handleRequest(err, user, info): Promise<any> {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }

  //   return await this.usersService.getUserbyId(user.id);
  // }
}
