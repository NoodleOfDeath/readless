
export const RESOURCE_TYPES = {
  article: 'article',
  interaction: 'interaction',
  media: 'media',
  outlet: 'outlet',
  summary: 'summary',
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];

export type ResourceSpecifier<Type extends ResourceType> = {
  type: Type;
  id: number;
};