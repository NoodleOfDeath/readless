import { MailTemplate, MailTemplateParams } from '../base';

export type WelcomeTemplateProps = MailTemplateParams;

export class WelcomeTemplate extends MailTemplate<WelcomeTemplateProps> {

  constructor(params: WelcomeTemplateProps) {
    super({
      content: [
        'Thank you for signing up! Make sure to follow us on social media to get the latest updates and news!',
        { text: 'TikTok', url: 'https://www.tiktok.com/@readless.ai' },
        { text: 'Instagram', url: 'https://www.instagram.com/readless.ai/' },
        { text: 'Discord', url: 'https://discord.gg/2gw3dP2a4u' },
      ],
      params,
      subject: 'Welcome to the Read Less Community',
    });
  }

}