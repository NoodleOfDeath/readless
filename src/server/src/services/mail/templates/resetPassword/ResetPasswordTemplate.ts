import { MailTemplate, MailTemplateParams } from '../base';

export type ResetPasswordParams = MailTemplateParams & {
  otp: string;
};

export class ResetPasswordTemplate extends MailTemplate<ResetPasswordParams> {

  constructor(params: ResetPasswordParams) {
    super({
      content: [
        'You have requested to reset your password. Please click the link below to reset your password. This link will expire in 15 minutes.',
        { text: 'Reset Password', url: `${params.domain}/verify/?otp=${params.otp}` },
        'If you did not request a password reset, you may disregard this message.',
      ],
      params,
      subject: 'Reset your password', 
    });
  }

}