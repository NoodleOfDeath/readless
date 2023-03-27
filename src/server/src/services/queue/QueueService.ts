import { Queue, QueueSpecifier } from '../../api/v1/schema';
import { Serializable } from '../../types';
import { BaseService } from '../base';

export class QueueService extends BaseService {

  static async dispatch<DataType extends Serializable, ReturnType, QueueName extends string = string>(
    queueProps: QueueSpecifier<DataType, ReturnType, QueueName>,
    jobName: string,
    payload: DataType
  ) {
    const queue = await this.getQueue(queueProps);
    await queue.add(jobName, payload);
  }

  static async getQueue<DataType extends Serializable, ReturnType, QueueName extends string = string>(queueProps: QueueSpecifier<DataType, ReturnType, QueueName>) {
    return await Queue.findOne({ where: { name: queueProps.name } }) ??
    await Queue.create({ name: queueProps.name });
  }

}
