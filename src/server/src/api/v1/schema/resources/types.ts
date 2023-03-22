import { ValuesOfKeys } from '../../../../types';

export const RESOURCE_TYPES = {
  article: 'article',
  interaction: 'interaction',
  media: 'media',
  outlet: 'outlet',
  source: 'source',
} as const;

export type ResourceType = ValuesOfKeys<typeof RESOURCE_TYPES>;

export type ResourceSpecifier<Type extends ResourceType> = {
  type: Type;
  id: number;
};