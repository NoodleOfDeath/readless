import { Serializable } from '../../../../types';
import { DatedAttributes, JobCreationAttributes } from '../types';

export type QueueState = 'active' | 'paused';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type QueueAttributes<D extends Serializable, R, Q extends string = string> = DatedAttributes & {
  name: Q;
  state: QueueState;
  data?: D;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type QueueCreationAttributes<D extends Serializable, R, Q extends string = string> = {
  name: Q;
  state?: QueueState;
  data?: D;
};

export type AddJobOptions<D extends Serializable, R, Q extends string = string> = Omit<JobCreationAttributes<D, R, Q>, 'queue' | 'name'> & {
  schedule?: Date;
};

export class QueueSpecifier<D extends Serializable, R = Serializable, Q extends string = string> implements QueueCreationAttributes<D, R, Q> {
  
  name: Q;
  state?: QueueState;
  data?: D;
  
  constructor(name: Q) {
    this.name = name;
  }
  
}