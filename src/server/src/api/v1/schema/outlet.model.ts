import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';
import { Attachment } from './attachment.model';

export type OutletAttributes = DatedAttributes & {
  /** name of this outlet */
  name: string;
  /** slug(s) of this outlet */
  slug: string[];
  /** base url of this outlet */
  baseUrl: string;
  /** exprs for matching new articles */
  exprs: string[];
};

export type OutletCreationAttributes = DatedAttributes & {
  name: string;
  slug: string[];
  baseUrl: string;
  exprs: string[];
};

@Table({
  modelName: 'outlet',
  timestamps: true,
  paranoid: true,
})
export class Outlet<
    A extends OutletAttributes = OutletAttributes,
    B extends OutletCreationAttributes = OutletCreationAttributes,
  >
  extends Model<A, B>
  implements OutletAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Outlet>): Partial<Outlet> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  slug: string[];

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
    unique: true,
  })
  baseUrl: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  exprs: string[];

  get attachments(): Promise<Attachment[]> {
    return Attachment.findAll({
      where: {
        resourceType: 'article',
        resourceId: this.id,
      },
    });
  }
}
