import { Column, DataType } from 'sequelize-typescript';

import { TranslationAttributes, TranslationCreationAttributes } from './Translation.types';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../../../core/locales';
import { GoogleService } from '../../../../../services';
import { BaseModel } from '../../base';

export class Translation<
  A extends TranslationAttributes = TranslationAttributes, 
  B extends TranslationCreationAttributes = TranslationCreationAttributes> 
  extends BaseModel<A, B> 
  implements TranslationAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare locale: SupportedLocale;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare attribute: string;
    
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare value: string;
  
  public static async translate<T extends { id?: number }>(
    model: T, 
    attributes: (keyof T)[], 
    locale: SupportedLocale | SupportedLocale[] = [...SUPPORTED_LOCALES]
  ) {
    if (Array.isArray(locale)) {
      await Promise.all(locale.map(async (l) => await this.translate(model, attributes, l)));
      return await this.scope('public').findAndCountAll({ where: { parentId: model.id } });
    } else {
      const translations = await this.scope('public').findAndCountAll({ where: { locale, parentId: model.id } });
      const filteredAttributes = attributes.filter((a) => !translations.rows.some((t) => t.attribute === a));
      for (const attribute of filteredAttributes) {
        const property = model[attribute];
        if (typeof property !== 'string') {
          continue;
        }
        const translatedString = /^en/i.test(locale) ? property : await GoogleService.translateText(Array.isArray(property) ? property.join('\n') : property, locale);
        await this.upsert({
          attribute: attribute as string,
          locale,
          parentId: model.id,
          value: translatedString,
        });
      }
      return await this.scope('public').findAndCountAll({ where: { locale, parentId: model.id } });
    }
  }
  
}