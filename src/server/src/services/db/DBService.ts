import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { addScopes, makeAssociations } from '../../api/v1/schema';
import { QUERIES } from '../../api/v1/schema';
import * as Models from '../../api/v1/schema/models';
import { BaseService } from '../base';

export type DBServiceInitProps = {
  connectionString?: string;
  models?: ModelCtor[];
  initializeViews?: boolean;
};

export class DBService extends BaseService {

  static sq: Sequelize;

  static async prepare({
    connectionString = process.env.PG_CONNECTION_STRING,
    models = [...Object.values(Models)],
    initializeViews,
  }: DBServiceInitProps = {}) {
    this.sq = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: { ssl: { rejectUnauthorized: false } },
      logging: process.env.SQL_LOGGING === 'true',
      models,
    });
    await this.sq.authenticate();
    makeAssociations();
    addScopes();
    // TODO: run prepare for all models here instead of all over the place
    // TODO: run SQL view update scripts
    await this.sq.sync();
    if (initializeViews) {
      for (const group of Object.values(QUERIES)) {
        if (!group.runOnStartUp) {
          continue; 
        }
        for (const query of group.order ?? []) {
          const q = group.queries[query].query;
          console.log('running query', q);
          try {
            await this.sq.query(q);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }

}
