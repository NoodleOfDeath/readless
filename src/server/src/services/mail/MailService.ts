import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import {
  ResetPasswordProps,
  ResetPasswordTemplate,
} from './templates/resetPassword/ResetPasswordTemplate';
import { VerifyEmailProps, VerifyEmailTemplate } from './templates/verifyEmail/VerifyEmailTemplate';
import { Optional } from '../../types';
import { BaseService } from '../base';

type MailServiceOptions = SMTPTransport.Options;

const TEMPLATES = { 
  resetPassword: ResetPasswordTemplate,
  verifyEmail: VerifyEmailTemplate,
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

  async sendMail<
    TemplateName extends keyof typeof TEMPLATES,
  >(
    opts: SMTPTransport.Options,
    templateName?: TemplateName,
    params?: Optional<typeof TEMPLATES[TemplateName]['prototype']['params'], 'domain'>
  ) {
    const options = {
      from: `<${process.env.MAIL_USER}> ReadLess`,
      ...opts,
    };
    if (templateName) {
      const template = new TEMPLATES[templateName]();
      options.subject = template.subject;
      if (template instanceof VerifyEmailTemplate) {
        options.html = template.render(params as VerifyEmailProps);
      } else if (template instanceof ResetPasswordTemplate) {
        options.html = template.render(params as ResetPasswordProps);
      }
    }
    return await this.client.sendMail(options);
  }

}
