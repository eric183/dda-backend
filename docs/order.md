// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id             Int              @id @default(autoincrement())
  username       String           @unique
  password       String
  email          String           @unique
  phoneNumber    String?
  avatar         String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  Bounty         Bounty[]
  BountyExecutor BountyExecutor[]
  // Withdrawal     Withdrawal?[]
  // Order          Order[]
  Session        Session[]
}

// Session model
model Session {
  id         Int      @id @default(autoincrement())
  tokenId    String   @unique
  createdAt  DateTime @default(now())
  accessedAt DateTime @updatedAt
  expiredAt  DateTime
  ipAddress  String?
  userAgent  String?
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
}

// 悬赏任务表
model Bounty {
  id             Int              @id @default(autoincrement())
  name           String
  description    String
  amount         Float
  status         String           @default("open")
  ownerId        Int
  owner          User             @relation(fields: [ownerId], references: [id])
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  BountyExecutor BountyExecutor[]
}

// 任务执行者表 (关系表)
model BountyExecutor {
  id          Int       @id @default(autoincrement())
  bountyId    Int
  bounty      Bounty    @relation(fields: [bountyId], references: [id])
  executorId  Int
  executor    User      @relation(fields: [executorId], references: [id])
  status      String    @default("in_progress")
  acceptTime  DateTime  @default(now())
  completedAt DateTime?
  canceledAt  DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// // 提现记录表
// model Withdrawal {
//   id          Int       @id @default(autoincrement())
//   userId      Int
//   user        User      @relation(fields: [userId], references: [id])
//   amount      Float
//   status      String    @default("pending")
//   requestTime DateTime  @default(now())
//   processTime DateTime?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
// }

// // 订单表
// model Order {
//   id          Int       @id @default(autoincrement())
//   userId      Int
//   user        User      @relation(fields: [userId], references: [id])
//   type        String
//   status      String    @default("pending")
//   amount      Float
//   createTime  DateTime  @default(now())
//   processTime DateTime?
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
// }
