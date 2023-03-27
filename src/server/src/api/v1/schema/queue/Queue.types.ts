import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type QueueState = 'active' | 'paused';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type QueueAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = DatedAttributes & {
  name: QueueName;
  state: QueueState;
  data?: DataType;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type QueueCreationAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = {
  name: QueueName;
  state?: QueueState;
  data?: DataType;
};

export class QueueSpecifier<DataType extends Serializable, ReturnType = Serializable, QueueName extends string = string> implements QueueCreationAttributes<DataType, ReturnType, QueueName> {
  
  name: QueueName;
  state?: QueueState;
  data?: DataType;
  
  constructor(name: QueueName) {
    this.name = name;
  }
  
}