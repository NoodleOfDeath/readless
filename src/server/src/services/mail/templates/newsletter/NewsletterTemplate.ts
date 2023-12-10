import { SummaryAttributes } from '../../../../api/v1/schema';
import { MailTemplate, MailTemplateParams } from '../base';

export type NewsletterParams = MailTemplateParams & {
  summaries: SummaryAttributes[];
};

export class NewsletterTemplate extends MailTemplate<NewsletterParams> {

  constructor(params: NewsletterParams) {
    super({ 
      content: [
        'Here are the latest top stories from Read Less:',
        ...params.summaries.map(summary => ({
          image: summary.imageUrl,
          text: summary.title,
          url: `${params.domain}/summary/${summary.id}`,
        })),
      ],
      params,
      subject: 'Newsletter', 
    });
  }

}