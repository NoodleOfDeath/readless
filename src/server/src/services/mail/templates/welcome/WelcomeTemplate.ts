import html from './html';
import { MailTemplate, MailTemplateParams } from '../base';

export type WelcomeTemplateProps = MailTemplateParams;

export class WelcomeTemplate extends MailTemplate<WelcomeTemplateProps> {

  constructor() {
    super({
      body: html,
      subject: 'Welcome to Read Less',
    });
  }

}