import { SEARCH_SUMMARIES } from './search';
import { GET_TOPICS } from './topics';

export const QUERIES = {
  getSummaries: SEARCH_SUMMARIES,
  getTopics: GET_TOPICS,
};

export type QueryKey = keyof typeof QUERIES;