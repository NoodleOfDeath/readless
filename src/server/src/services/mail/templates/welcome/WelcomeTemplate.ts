import { MailTemplate, MailTemplateParams } from '../base';

export type WelcomeTemplateProps = MailTemplateParams;

export class WelcomeTemplate extends MailTemplate<WelcomeTemplateProps> {

  constructor(params: WelcomeTemplateProps) {
    super({
      content: [
        'Thank you for signing up! Make sure to follow us on TikTok to get the latest updates and news!',
        { text: 'TikTok', url: 'https://www.tiktok.com/@readless.ai' },
      ],
      params,
      subject: 'Welcome to the Read Less Community',
    });
  }

}