import { MailTemplate, MailTemplateParams } from '../base';

export type DeleteAccountParams = MailTemplateParams & {
  otp: string;
};

export class DeleteAccountTemplate extends MailTemplate<DeleteAccountParams> {

  constructor(params: DeleteAccountParams) {
    super({
      content: [
        'You have requested to delete your account. Please click the link below to delete your account. This link will expire in 15 minutes.',
        { text: 'Delete Your Account', url: `${params.domain}/delete/?otp=${params.otp}` },
        'If you did not request for your account to be deleted, you may disregard this message.',
      ],
      params,
      subject: 'Delete Your Account', 
    });
  }

}