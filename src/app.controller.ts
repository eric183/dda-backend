import {
  Controller,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  // constructor(private authService: AuthService) {}
  @Get()
  async getIndex() {
    return 'hello?';
  }

  // // @UseGuards(AuthGuard('local'))
  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async login(@Request() req) {
  //   // return this.authService.login(req.user);
  // }
}
