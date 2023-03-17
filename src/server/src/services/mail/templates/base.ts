
export type EmailTemplateParams = {
  domain: string;
  email: string;
}

export type EmailTemplateProps = {
  subject: string;
  body: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class EmailTemplate<Params extends EmailTemplateParams> implements EmailTemplateProps {

  subject: string;
  body: string;
  params: Params;

  constructor({ 
    subject, 
    body, 
  }: EmailTemplateProps) {
    this.subject = subject;
    this.body = body;
  }

  render({
    domain = process.env.CORS_ORIGIN,
    ...rest
  }: Omit<Params, 'domain'> & { domain?: string } = {} as Params) {
    const params = { domain, ...rest };
    let html = this.body;
    Object.entries(params ?? {}).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, value);
    });
    return html;
  }

}