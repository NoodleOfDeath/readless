import { Optional } from '../../../types';

export type MailTemplateParams = {
  domain: string;
  email: string;
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
    domain = process.env.CORS_ORIGIN,
    ...rest
  }: Optional<Params, 'domain'> = {} as Params) {
    let html = this.body;
    Object.entries({ domain, ...rest }).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, value);
    });
    return html;
  }

}