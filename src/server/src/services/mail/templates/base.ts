import { Optional } from '../../../types';

export type MailTemplateParams = {
  domain: string;
  email: string;
  ssl: boolean;
};

export type MailTemplateProps = {
  subject: string;
  body: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class MailTemplate<Params extends MailTemplateParams> implements MailTemplateProps {

  subject: string;
  body: string;
  params: Params;

  constructor({ 
    subject, 
    body, 
  }: MailTemplateProps) {
    this.subject = subject;
    this.body = body;
  }

  render({
    ssl = Boolean(process.env.SSL),
    domain = [ssl ? 'https://' : 'http://', process.env.BASE_DOMAIN].join(''),
    ...rest
  }: Optional<Params, 'domain' | 'ssl'> = {} as Params) {
    let html = this.body;
    Object.entries({ domain, ...rest }).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, value);
    });
    return html;
  }

}