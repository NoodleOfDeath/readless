import { 
  PublicSummaryAttributes,
  PublicSummarySentimentAttributes,
  ReadingFormat,
} from '~/api';

export const shareableLink = (
  summary: PublicSummaryAttributes, 
  baseUrl: string, 
  format: ReadingFormat = ReadingFormat.Summary
) => {
  return `${baseUrl}/read/?s=${summary.id}&f=${format}`;
};

export const readingFormat = (str = ''): ReadingFormat => {
  switch (str) {
  case 'bullets':
    return ReadingFormat.Bullets;
  default:
    return ReadingFormat.Summary;
  }
};

export const fixedSentiment = (sentiment?: number) => {
  return sentiment ? `${sentiment > 0 ? '+' : ''}${sentiment.toFixed(2)}` : '0.00';
};

export const averageOfSentiments = (sentiments: PublicSummarySentimentAttributes[] | Record<string, PublicSummarySentimentAttributes>) => {
  if (!sentiments) {
    return { score: 0, tokens: [] };
  }
  const values = Object.values(sentiments);
  if (values.length === 0) {
    return { score: 0, tokens: [] };
  }
  const scores = values.reduce((curr, next) => {
    return curr + next.score;
  }, 0);
  return { score: scores / values.length };
};