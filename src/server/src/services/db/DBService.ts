import { ModelCtor, Sequelize } from 'sequelize-typescript';

import * as Models from '../../api/v1/schema/models';
import { BaseService } from '../base';
import { makeAssociations } from '../../api/v1/schema';

export type DBServiceInitProps = {
  connectionString?: string;
  models?: ModelCtor[];
};

export class DBService extends BaseService {
  sq: Sequelize;

  constructor({
    connectionString = process.env.PG_CONNECTION_STRING,
    models = [...Object.values(Models)],
  }: DBServiceInitProps = {}) {
    super();
    this.sq = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: { ssl: { rejectUnauthorized: false, }, },
      models,
    });
    makeAssociations();
  }

  static async init() {
    const db = new DBService();
    await db.init();
    return db;
  }

  async init() {
    await this.sq.authenticate();
    console.log(process.env.NODE_ENV);
    await this.sq.sync({ force: process.env.NODE_ENV !== 'production' });
  }

}
