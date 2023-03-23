import {
  Job,
  Queue,
  QueueAttributes,
} from '../../api/v1/schema';
import { Serializable } from '../../types';
import { BaseService } from '../base';

export class QueueService extends BaseService {

  static async initQueues() {
    for (const queue of Object.values(Queue.QUEUES)) {
      await Queue.upsert({ name: queue.name });
    }
  }

  static async dispatch<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string>(
    jobQueue: QueueAttributes<DataType, ReturnType, QueueName>,
    jobName: string,
    payload: DataType
  ) {
    const queue = await this.getQueue(jobQueue);
    await queue.add(jobName, payload);
  }

  static async getQueue<DataType extends Serializable, ReturnType extends Serializable, NameType extends string = string>(jobQueue: QueueAttributes<DataType, ReturnType, NameType>) {
    return await Queue.findOne({ where: { name: jobQueue.name } }) ??
    await Queue.create({ name: jobQueue.name });
  }

}

export class Worker<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string> {

  queueProps: QueueAttributes<DataType, ReturnType, QueueName>;
  handler: (job: Job<DataType, ReturnType, QueueName>) => Promise<ReturnType>;

  get queue() {
    return QueueService.getQueue(this.queueProps);
  }

  constructor(
    queueProps: QueueAttributes<DataType, ReturnType, QueueName>,
    handler: (job: Job<DataType, ReturnType, QueueName>) => Promise<ReturnType>
  ) {
    this.queueProps = queueProps;
    this.handler = handler;
  }

}
