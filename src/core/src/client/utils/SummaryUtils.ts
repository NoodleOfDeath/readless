import { 
  PublicPublisherAttributes,
  PublicSummaryGroup,
  PublicSummarySentimentAttributes,
  ReadingFormat,
} from '~/api';

export const shareableLink = (
  summary: PublicSummaryGroup, 
  baseUrl: string,
  format: ReadingFormat = ReadingFormat.Summary
) => {
  return `https://open.${baseUrl.replace(/https?:\/\/(?:www\.)?/, '')}/s/${summary.id}/${format}`;
};

export const publisherIcon = (publisher: PublicPublisherAttributes) => {
  return `https://readless.nyc3.cdn.digitaloceanspaces.com/img/pub/${publisher.name}.png`;
};

export const audioStreamUri = (
  summary: PublicSummaryGroup,
  baseUrl: string,
  locale = 'en'
) => {
  return `${baseUrl}/v1/service/stream/s/${summary.id}?locale=${locale}`;
};

export const readingFormat = (str = ''): ReadingFormat => {
  switch (str) {
  case 'bullets':
    return ReadingFormat.Bullets;
  case 'fullArticle':
    return ReadingFormat.FullArticle;
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