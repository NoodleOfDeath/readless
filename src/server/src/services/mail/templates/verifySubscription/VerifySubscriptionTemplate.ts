import html from './html';
import { MailTemplate, MailTemplateParams } from '../base';

export type VerifySubscriptionProps = MailTemplateParams & {
  verificationCode: string;
};

export class VerifySubscriptionTemplate extends MailTemplate<VerifySubscriptionProps> {

  constructor() {
    super({
      body: html,
      subject: 'Verify your subscription',
    });
  }

}