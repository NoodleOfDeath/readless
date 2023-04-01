import { DatedAttributes } from '../types';

export const READING_FORMATS = {
  bullets: 'bullets',
  casual: 'casual',
  concise: 'concise',
  detailed: 'detailed',
  inDepth: 'in-depth',
} as const;

export type ReadingFormat = typeof READING_FORMATS[keyof typeof READING_FORMATS];

export type PostContentAttributes = DatedAttributes & {
  parentId: number;
  format: ReadingFormat;
  content: string;
};

export type PostContentCreationAttributes = {
  parentId: number;
  format: ReadingFormat;
  content: string;
};