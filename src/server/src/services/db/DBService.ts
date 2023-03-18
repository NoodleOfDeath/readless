import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { makeAssociations } from '../../api/v1/schema';
import * as Models from '../../api/v1/schema/models';
import { BaseService } from '../base';

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
      dialectOptions: { ssl: { rejectUnauthorized: false } },
      logging: !!process.env.SQL_LOGGING,
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
    await this.sq.sync({ alter: true });
  }

}
