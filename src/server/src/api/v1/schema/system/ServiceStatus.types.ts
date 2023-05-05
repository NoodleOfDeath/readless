import { DatedAttributes } from '../types';

export type ServiceStatusAttributes = DatedAttributes & {
  serviceId: number;
  status: string;
};

export type ServiceStatusCreationAttributes = { 
  serviceId: number;
  status: string;
};