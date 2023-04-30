import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TUser, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByMail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const ifPass = await this.hashService.comparePassword(pass, user.password);
    if (user && ifPass) {
      // const { password, ...result } = user;
      return user;
    }

    return null;
  }

  async login(user: TUser & { id: string }) {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
