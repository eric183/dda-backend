import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// Decorator to check if user is authenticated
export const AuthUser = createParamDecorator(
  (data: number, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log('....req.user', req);

    return req.user;
  },
);
// return function (target: any, key: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;
//   descriptor.value = function (...args: any[]) {
//     const req = args[0];
//     if (!req.user) {
//       throw new Error('Unauthorized');
//     }
//     return originalMethod.apply(this, args);
//   };
//   return descriptor;
// };
// } // Path: dda-backend/src/decorators/auth.ts
