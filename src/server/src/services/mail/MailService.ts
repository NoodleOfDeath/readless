import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import {
  NewsletterTemplate,
  VerifySubscriptionTemplate,
  WelcomeTemplate,
} from './templates';
import { DeleteAccountTemplate } from './templates/deleteAccount/DeleteAccountTemplate';
import { ResetPasswordTemplate } from './templates/resetPassword/ResetPasswordTemplate';
import { VerifyEmailTemplate } from './templates/verifyEmail/VerifyEmailTemplate';
import { Optional } from '../../types';
import { BaseService } from '../base';

export type MailServiceOptions = SMTPTransport.Options;

const BASE_DOMAIN = /localhost/.test(process.env.BASE_DOMAIN) ? 'readless://' : process.env.BASE_DOMAIN;

const TEMPLATES = { 
  deleteAccount: DeleteAccountTemplate,
  newsletter: NewsletterTemplate,
  resetPassword: ResetPasswordTemplate,
  verifyEmail: VerifyEmailTemplate,
  verifySubscription: VerifySubscriptionTemplate,
  welcome: WelcomeTemplate,
} as const;

export class MailService extends BaseService {

  client: Transporter;
  
  constructor({
    host = process.env.MAIL_HOST,
    port = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
    secure = true,
    auth = {
      pass: process.env.MAIL_PASS,
      user: process.env.MAIL_USER,
    },
  }: Partial<MailServiceOptions> = {}) {
    super();
    this.client = createTransport({
      auth,
      host,
      port,
      secure,
    });
  }

  async sendMail({
    from = process.env.MAIL_REPLY_TO,
    ...opts
  }: SMTPTransport.Options) {
    return await this.client.sendMail({
      from, 
      ...opts,
    });
  }

  async sendMailFromTemplate<
    TemplateName extends keyof typeof TEMPLATES,
  >(
    templateName: TemplateName,
    opts: SMTPTransport.Options,
    params?: Optional<typeof TEMPLATES[TemplateName]['prototype']['params'], 'domain' | 'ssl'>
  ) {
    const options = {
      from: process.env.MAIL_REPLY_TO,
      ...opts,
    };
    const args = {
      domain: [BASE_DOMAIN === 'readless://' ? '' : (process.env.SSL ? 'https://' : 'http://'), BASE_DOMAIN].filter(Boolean).join(''),
      ssl: Boolean(process.env.SSL),
      ...params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const template = new TEMPLATES[templateName](args);
    options.subject = template.subject;
    options.html = template.rendered;
    return await this.client.sendMail(options);
  }

}
