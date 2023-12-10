import { MailTemplate, MailTemplateParams } from '../base';

export type VerifySubscriptionParams = MailTemplateParams & {
  verificationCode: string;
};

export class VerifySubscriptionTemplate extends MailTemplate<VerifySubscriptionParams> {

  constructor(params: VerifySubscriptionParams) {
    super({ 
      content: [
        'Please click the button below to verify your subscription to the Read Less newsletter.',
        { text: 'Verify Subscription', url: `${params.domain}/verify?code=${params.verificationCode}` },
        'If you did not request a newsletter subscription, please disregard this message or notify us via <a href=\'mailto:thecakeisalie@readless.ai\'>support@readless.ai</a>',
      ],
      params,
      subject: 'Verify your subscription',
    });
  }

}