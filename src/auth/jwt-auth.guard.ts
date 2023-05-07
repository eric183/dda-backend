import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TUser, UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  usersService: UsersService;
  async canActivate(context: ExecutionContext): Promise<any> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
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
