import { SEARCH_SUMMARIES } from './search';
import { GET_TOP_STORIES } from './top_stories';

export const QUERIES = {
  getSummaries: SEARCH_SUMMARIES,
  getTopStories: GET_TOP_STORIES,
};

export type QueryKey = keyof typeof QUERIES;