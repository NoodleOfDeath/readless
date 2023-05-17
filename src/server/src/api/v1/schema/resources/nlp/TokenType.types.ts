import { DatedAttributes } from '../../types';

export const TOKEN_TYPE_NAMES = [
  'business',
  'event',
  'group',
  'innovation',
  'organization',
  'person',
  'place',
  'software/app',
  'sports-team',
  'video-game',
] as const;

export type TokenTypeName = typeof TOKEN_TYPE_NAMES[number];

export type TokenTypeAttributes = DatedAttributes & {
  /** type of this type */
  name: TokenTypeName;
  /** display name of this type */
  displayName: string;
};

export type TokenTypeCreationAttributes = Partial<DatedAttributes> & {
  name: TokenTypeName;
  displayName: string;
};

export const PUBLIC_TOKEN_TYPE_ATTRIBUTES = ['id', 'name', 'displayName'] as const;

export type PublicTokenTypeAttributes = {
  name: TokenTypeName;
  displayName: string;
};

export const TOKEN_TYPES: Record<string, TokenTypeCreationAttributes> = {
  business: {
    displayName: 'Business',
    name: 'business',
  },
  event: {
    displayName: 'Event',
    name: 'event',
  },
  group: {
    displayName: 'Group',
    name: 'group',
  },
  innovation: {
    displayName: 'Innovation',
    name: 'innovation',
  },
  organization: {
    displayName: 'Organization',
    name: 'organization',
  },
  person: {
    displayName: 'Person',
    name: 'person',
  },
  place: {
    displayName: 'Place',
    name: 'place',
  },
  software: {
    displayName: 'Software/App',
    name: 'software/app',
  },
  sportsTeam: {
    displayName: 'Sports Team',
    name: 'sports-team',
  },
  videoGame: {
    displayName: 'Video Game',
    name: 'video-game',
  },
};

