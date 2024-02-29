import { MailTemplate, MailTemplateParams } from '../base';

export type VerifyEmailParams = MailTemplateParams & {
  verificationCode: string;
};

export class VerifyEmailTemplate extends MailTemplate<VerifyEmailParams> {

  constructor(params: VerifyEmailParams) {
    super({ 
      content: [
        'Thank you for signing up! To complete your registration, please click the button below to verify your email address:',
        { text: 'Verify Email', url: `${params.domain}/verify/?channel=email&code=${params.verificationCode}` },
        'If you did not create an account, please disregard this message.',
      ],
      params,
      subject: 'Verify your email',
    });
  }

}