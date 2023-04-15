import { PublicSummaryAttributes, ReadingFormat } from '~/api';

export class SummaryUtils {

  static shareableLink(summary: PublicSummaryAttributes, baseUrl: string, format: ReadingFormat = ReadingFormat.Concise) {
    return `${baseUrl}/read/?s=${summary.id}&f=${format}`;
  }

  static format(str = ''): ReadingFormat {
    switch (str) {
    case 'bullets':
      return ReadingFormat.Bullets;
    case 'casual':
      return ReadingFormat.Casual;
    case 'detailed':
      return ReadingFormat.Detailed;
    case 'in-depth':
      return ReadingFormat.InDepth;
    default:
      return ReadingFormat.Concise;
    }
  }

}