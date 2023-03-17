import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type MediaAttributes = DatedAttributes & {
  /** name of this media */
  type: string;
  /** base url of this media */
  url: string;
};

export type MediaCreationAttributes = DatedAttributes & {
  type: string;
  url: string;
};

@Table({
  modelName: 'media',
  paranoid: true,
  timestamps: true,
})
export class Media<
    A extends MediaAttributes = MediaAttributes,
    B extends MediaCreationAttributes = MediaCreationAttributes,
  >
  extends Model<A, B>
  implements MediaAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Media>): Partial<Media> {
    return defaults ?? {};
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    url: string;

}
