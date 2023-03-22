import html from './html';
import { MailTemplate, MailTemplateParams } from '../base';

export type ResetPasswordProps = MailTemplateParams & {
  otp: string;
};

export class ResetPasswordTemplate extends MailTemplate<ResetPasswordProps> {

  constructor() {
    super({
      body: html,
      subject: 'Reset your password',
    });
  }

}