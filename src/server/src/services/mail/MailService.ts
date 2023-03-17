import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { VerifyEmailTemplate } from './templates/verify/VerifyEmailTemplate';
import { BaseService } from '../base';

type MailServiceOptions = SMTPTransport.Options;

const TEMPLATES = { verify: VerifyEmailTemplate } as const;

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
  >(opts: SMTPTransport.Options,
    templateName?: TemplateName, 
    params?: Omit<typeof TEMPLATES[TemplateName]['prototype']['params'], 'domain'>) {
    const options = {
      from: `<${process.env.MAIL_USER}> theSkoop`,
      ...opts,
    };
    if (templateName) {
      const template = new TEMPLATES[templateName]();
      options.subject = template.subject;
      options.html = template.render(params);
    }
    return await this.client.sendMail(options);
  }

}
