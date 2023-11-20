import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { VerifySubscriptionTemplate, WelcomeTemplate } from './templates';
import { DeleteAccountTemplate } from './templates/deleteAccount/DeleteAccountTemplate';
import { ResetPasswordTemplate } from './templates/resetPassword/ResetPasswordTemplate';
import { VerifyEmailTemplate } from './templates/verifyEmail/VerifyEmailTemplate';
import { Optional } from '../../types';
import { BaseService } from '../base';

export type MailServiceOptions = SMTPTransport.Options;

const TEMPLATES = { 
  deleteAccount: DeleteAccountTemplate,
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
    opts: SMTPTransport.Options,
    templateName?: TemplateName,
    params?: Optional<typeof TEMPLATES[TemplateName]['prototype']['params'], 'domain' | 'ssl'>
  ) {
    const options = {
      from: process.env.MAIL_REPLY_TO,
      ...opts,
    };
    if (templateName) {
      const template = new TEMPLATES[templateName]();
      options.subject = template.subject;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.html = template.render(params as any);
    }
    return await this.client.sendMail(options);
  }

}
