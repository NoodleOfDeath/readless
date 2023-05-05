import { DatedAttributes } from '../types';

export type ServiceStatusAttributes = DatedAttributes & {
  serviceId: number;
  state: string;
};

export type ServiceStatusCreationAttributes = { 
  serviceId: number;
  state: string;
};