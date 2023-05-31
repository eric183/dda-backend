import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

@Module({
  imports: [
    MailerModule.forRoot({
      // SMPT の設定
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: 'kk297466058@gmail.com',
          pass: 'ixxuzqwxxxvlfogo',
        },
      }, // デフォルトでの送信元メールアドレスの設定
      defaults: {
        from: 'kk297466058@gmail.com',
      },
      // テンプレートの設定
      template: {
        dir: join(__dirname, '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
