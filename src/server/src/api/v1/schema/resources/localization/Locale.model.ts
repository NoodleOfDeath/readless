import { 
  Column, 
  DataType,
  Table,
} from 'sequelize-typescript';

import { LocaleAttributes, LocaleCreationAttributes } from './Locale.types';
import {
  SUPPORTED_LOCALES,
  ClientSupportedLocale as SupportedLocale,
} from '../../../../../core/locales';
import { BaseModel } from '../../base';

@Table({
  modelName: 'locale',
  paranoid: true,
  timestamps: true,
})
export class Locale<
  A extends LocaleAttributes = LocaleAttributes, 
  B extends LocaleCreationAttributes = LocaleCreationAttributes> 
  extends BaseModel<A, B> 
  implements LocaleAttributes {
    
  public static async prepare() {
    for (const locale of SUPPORTED_LOCALES) {
      await Locale.upsert({ code: locale });
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare code: SupportedLocale;
  
}