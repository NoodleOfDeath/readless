import { DatedAttributes } from '../types';

export type UserAttributes = DatedAttributes;

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;