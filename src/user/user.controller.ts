// user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { Prisma } from '@prisma/client';
import { QueryDto } from 'src/dto/query.dto';

// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles('admin')
  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  async getAllUsers(@Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    } = query;

    return this.userService.findAll({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      filters,
    });
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: '根据ID获取用户' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUser({ id });
  }

  //创建邀请码
  @Post('invite')
  @Roles('admin')
  @ApiOperation({ summary: '创建邀请码' })
  async createInviteCode({
    userId,
    expirationDays,
  }: {
    userId: string;
    expirationDays: number;
  }) {
    return this.userService.createInviteCode(userId);
  }

  //根据邀请码创建用户
  @Post()
  @ApiOperation({ summary: '创建用户' })
  async createUser(
    @Body()
    createUserDto: Prisma.UserCreateInput,
  ) {
    // console.log('createUserDto', createUserDto);
    return this.userService.createUser({ ...createUserDto, isActive: true });
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(
    @Param('id') id: string,
    @Body()
    updateUserDto: {
      email?: string;
      name?: string;
      roleId?: string;
      isActive?: boolean;
    },
  ) {
    return this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
  }

  // @Roles('admin')
  //更新用户密码
  @Patch(':id/password')
  @ApiOperation({ summary: '更新用户密码' })
  async updateUserPassword(
    @Param('id') id: string,
    @Body()
    updateUserPasswordDto: {
      password: string;
    },
  ) {
    return this.userService.updateUserPassword(
      id,
      updateUserPasswordDto.password,
    );
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }
}
