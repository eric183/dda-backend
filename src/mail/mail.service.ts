import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

interface IMailBody extends Partial<ISendMailOptions> {
  email: string;
  name: string;
  subject: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, context }: Partial<ISendMailOptions>) {
    console.log('to............', to);
    console.log('subject............', subject);
    console.log('context............', context);

    const result = await this.mailerService
      .sendMail({
        to,
        subject: subject,
        template: './test',
        context,
      })
      .catch((err) => {
        console.log('Error in sending mail', err);
        throw new Error('Failed to send verification code to the email');
      });

    console.log(result, 'result............');
    console.log('code............', context.code);
    return 'sent';
  }
}
