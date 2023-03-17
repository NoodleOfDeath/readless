import html from './html';
import { EmailTemplate, EmailTemplateParams } from '../base';

export type VerifyEmailProps = EmailTemplateParams & {
  verificationCode: string;
}

export class VerifyEmailTemplate extends EmailTemplate<VerifyEmailProps> {

  constructor(
  ) {
    super({
      body: html,
      subject: 'Verify your email',
    });
  }

}