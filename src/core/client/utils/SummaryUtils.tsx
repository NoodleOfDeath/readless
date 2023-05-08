import { 
  PublicSummaryAttributes,
  ReadingFormat,
  SummarySentimentAttributes,
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

export const averageOfSentiments = (sentiments: SummarySentimentAttributes[] | Record<string, SummarySentimentAttributes>) => {
  if (!sentiments) {
    return { score: 0, tokens: [] };
  }
  const values = Object.values(sentiments);
  if (values.length === 0) {
    return { score: 0, tokens: [] };
  }
  const tokens: Set<string> = new Set<string>();
  const scores = values.reduce((curr, next) => {
    Object.values(next.tokens ?? [])?.forEach((t) => tokens.add(t.text), tokens);
    return curr + next.score;
  }, 0);
  return {
    score: scores / values.length,
    tokens: Array.from(tokens).sort((a, b) => 
      a.toLowerCase() < b.toLowerCase() ? -1 :
        a.toLowerCase() > b.toLowerCase() ? 1 : 0),
  };
};