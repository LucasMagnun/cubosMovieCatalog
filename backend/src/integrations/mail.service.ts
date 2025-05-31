import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  async onModuleInit() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('Ethereal test account:', testAccount);
  }

  async sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
    const info = await this.transporter.sendMail({
      from: '"My Movie App" <no-reply@movieapp.com>',
      to,
      subject,
      text,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
}
