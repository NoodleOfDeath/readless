import {
  Column, DataType, Model, Table 
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type SiteMapParams = string | string[][];

export type SiteMap = {
  /**
   * Template url for retrieving news articles
   * Can contain template options such as:
   * YYYY = 4-digit year (current)
   * YY = 2-digit year (current)
   * MMMM = month name (current)
   * MM = 2-digit month (current)
   * M = 1/2-digit month (current)
   * DD = 2-digit day (current)
   * D = 1/2 digit day (current)
   * $1, $2, ... = param1, param2, ...
   */
  url: string;
  /** template params to dynamically interpolate */
  params?: SiteMapParams;
  /** keep query string */
  keepQuery?: boolean;
  /** css selector(s) for getting news links */
  selector: string;
  /** attribute to extract from retrieved html nodes; if nothing is specified the element's `innerHTML` is used */
  attribute?: 'href' | 'src';
};

export type FetchPolicy = {
  count: number;
  window: number;
};

export type OutletAttributes = DatedAttributes & {
  /** name of this outlet */
  name: string;
  /** xml site maps for this outlet and selector for extracting urls */
  siteMaps: SiteMap[];
  /** fetch policy for this outlet */
  fetchPolicy?: FetchPolicy;
};

export type OutletCreationAttributes = DatedAttributes & {
  name: string;
  siteMaps: SiteMap[];
  fetchPolicy?: FetchPolicy;
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
    type: DataType.ARRAY(DataType.JSON),
    allowNull: false,
  })
    siteMaps: SiteMap[];

  @Column({ type: DataType.JSON, })
    fetchPolicy: FetchPolicy;

}
