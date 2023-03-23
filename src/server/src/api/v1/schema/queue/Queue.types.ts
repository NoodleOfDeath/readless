import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type QueueAttributes<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string> = DatedAttributes & {
  name: QueueName;
  data?: DataType;
  resp?: ReturnType;
};

export type QueueCreationAttributes<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string> = {
  name: QueueName;
  data?: DataType;
  resp?: ReturnType;
};

export class QueueSpecifier<DataType extends Serializable, ReturnType extends Serializable = Serializable, QueueName extends string = string> implements QueueCreationAttributes<DataType, ReturnType, QueueName> {
  
  name: QueueName;
  data?: DataType;
  resp?: ReturnType;
  
  constructor(name: QueueName) {
    this.name = name;
  }
  
}