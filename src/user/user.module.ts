// user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PrismaService],
})
export class UserModule {}

// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';

// @Module({
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}

// // user/user.module.ts
// // import { Module } from '@nestjs/common';
// // import { UserService } from './user.service';
// // import { UserController } from './user.controller';
// // import { PrismaModule } from '../prisma/prisma.module';

// // @Module({
// //   imports: [PrismaModule],
// //   providers: [UserService],
// //   controllers: [UserController],
// //   exports: [UserService],
// // })
// // export class UserModule {}
