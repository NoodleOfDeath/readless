import pg from 'pg';
import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { makeAssociations } from '../../api/v1/schema';
import * as Models from '../../api/v1/schema/models';
import { BaseService } from '../base';

export type DBServiceInitProps = {
  connectionString?: string;
  models?: ModelCtor[];
};

export class DBService extends BaseService {

  static sq: Sequelize;
  client: pg.Client;

  static async initTables({
    connectionString = process.env.PG_CONNECTION_STRING,
    models = [...Object.values(Models)],
  }: DBServiceInitProps = {}) {
    this.sq = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: { ssl: { rejectUnauthorized: false } },
      logging: !!process.env.SQL_LOGGING,
      models,
    });
    await this.sq.authenticate();
    await this.sq.sync();
    makeAssociations();
  }

  static client() {
    return new pg.Client({
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    });
  }

  static pool() {
    return new pg.Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    });
  }

}
