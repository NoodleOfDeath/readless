import html from './html';
import { MailTemplate, MailTemplateParams } from '../base';

export type DeleteAccountProps = MailTemplateParams & {
  otp: string;
};

export class DeleteAccountTemplate extends MailTemplate<DeleteAccountProps> {

  constructor() {
    super({
      body: html,
      subject: 'Delete Your Account',
    });
  }

}