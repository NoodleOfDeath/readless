import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';
import { Attachment } from './attachment.model';

export type SiteMap = {
  url: string;
  selector: string;
  attribute?: 'href' | 'src';
};

export type OutletAttributes = DatedAttributes & {
  /** name of this outlet */
  name: string;
  /** slug */
  slug: string;
  /** xml site maps for this outlet and selector for extracting urls */
  siteMaps: SiteMap[];
};

export type OutletCreationAttributes = DatedAttributes & {
  name: string;
  slug: string;
  siteMaps: SiteMap[];
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
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    allowNull: false,
  })
  siteMaps: SiteMap[];

  get attachments(): Promise<Attachment[]> {
    return Attachment.findAll({
      where: {
        resourceType: 'article',
        resourceId: this.id,
      },
    });
  }
}
