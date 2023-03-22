import html from './html';
import { MailTemplate, MailTemplateParams } from '../base';

export type VerifyEmailProps = MailTemplateParams & {
  verificationCode: string;
};

export class VerifyEmailTemplate extends MailTemplate<VerifyEmailProps> {

  constructor() {
    super({
      body: html,
      subject: 'Verify your email',
    });
  }

}