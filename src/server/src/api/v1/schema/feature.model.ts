import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from './dated';

export type FeatureAttributes = DatedAttributes & {
  name: string;
  enabled: boolean;
  data?: Record<string, unknown>;
};

export type FeatureCreationAttributes = DatedAttributes & {
  name: string;
  enabled: boolean;
  data?: Record<string, unknown>;
};

@Table({
  modelName: 'feature',
  paranoid: true,
  timestamps: true,
})
export class Feature<A extends FeatureAttributes = FeatureAttributes, B extends FeatureCreationAttributes = FeatureCreationAttributes>
  extends Model<A, B>
  implements FeatureAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Feature>): Partial<Feature> {
    return defaults ?? {};
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;
  
  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
    enabled: boolean;
  
  @Column({ type: DataType.JSON })
    data: Record<string, unknown>;
    
}
