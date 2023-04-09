import { 
  Column,
  DataType,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { 
  CategoryAttributes, 
  CategoryCreationAttributes,
  PUBLIC_CATEGORY_ATTRIBUTES,
} from './Category.types';
import { BaseModel } from '../../base';

@Scopes(() => ({ public: { attributes: [...PUBLIC_CATEGORY_ATTRIBUTES] } }))
@Table({
  modelName: 'category',
  paranoid: true,
  timestamps: true,
})
export class Category<
  A extends CategoryAttributes = CategoryAttributes, 
  B extends CategoryCreationAttributes = CategoryCreationAttributes> 
  extends BaseModel<A, B> 
  implements CategoryAttributes {
  
  public static CATEGORIES: Record<string, CategoryCreationAttributes> = {
    Art: { icon: 'palette', name: 'Art' },
    'Artificial Intelligence': { icon: 'brain', name: 'Artificial Intelligence' },
    Automotive: { icon: 'car', name: 'Automotive' },
    Books: { icon: 'book-open-variant', name: 'Books' },
    Business: { icon: 'domain', name: 'Business' },
    Crime: { icon: 'police-badge', name: 'Crime' },
    Cryptocurrency: { icon: 'bitcoin', name: 'Cryptocurrency' },
    Culture: { icon: 'cannabis', name: 'Culture' },
    Disasters: { icon: 'weather-tornado', name: 'Disasters' },
    Economics: { icon: 'cash', name: 'Economics' },
    Education: { icon: 'school', name: 'Education' },
    Energy: { icon: 'barrel', name: 'Energy' },
    Entertainment: { icon: 'popcorn', name: 'Entertainment' },
    Environment: { icon: 'sprout', name: 'Environment' },
    Fashion: { icon: 'shoe-heel', name: 'Fashion' },
    Finance: { icon: 'currency-usd', name: 'Finance' },
    Food: { icon: 'food', name: 'Food' },
    Gaming: { icon: 'controller-classic', name: 'Gaming' },
    Geopolitics: { icon: 'handshake', name: 'Geopolitics' },
    Health: { icon: 'weight-lifter', name: 'Health' },
    Healthcare: { icon: 'medical-bag', name: 'Healthcare' },
    History: { icon: 'pillar', name: 'History' },
    'Home Improvement': { icon: 'home-heart', name: 'Home Improvement' },
    Inspiration: { icon: 'lightbulb-on', name: 'Inspiration' },
    Journalism: { icon: 'feather', name: 'Journalism' },
    Labor: { icon: 'briefcase', name: 'Labor' },
    Legal: { icon: 'gavel', name: 'Legal' },
    Lifestyle: { icon: 'shoe-sneaker', name: 'Lifestyle' },
    Media: { icon: 'account-group', name: 'Media' },
    Medicine: { icon: 'needle', name: 'Medicine' },
    Music: { icon: 'music', name: 'Music' },
    Obituary: { icon: 'grave-stone', name: 'Obituary' },
    Other: { icon: 'progress-question', name: 'Other' },
    Pandemic: { icon: 'virus', name: 'Pandemic' },
    Parenting: { icon: 'human-male-child', name: 'Parenting' },
    Pets: { icon: 'dog', name: 'Pets' },
    Philosophy: { icon: 'head-dots-horizontal', name: 'Philosophy' },
    Politics: { icon: 'bank-outline', name: 'Politics' },
    'Pop Culture': { icon: 'bullhorn', name: 'Pop Culture' },
    Productivity: { icon: 'tools', name: 'Productivity' },
    'Real Estate': { icon: 'home-group', name: 'Real Estate' },
    Religion: { icon: 'cross', name: 'Religion' },
    Robotics: { icon: 'robot-industrial', name: 'Robotics' },
    Royalty: { icon: 'crown', name: 'Royalty' },
    Science: { icon: 'flask', name: 'Science' },
    Shopping: { icon: 'shopping', name: 'Shopping' },
    Space: { icon: 'space-station', name: 'Space' },
    Sports: { icon: 'basketball', name: 'Sports' },
    Technology: { icon: 'chip', name: 'Technology' },
    Television: { icon: 'television-classic', name: 'Television' },
    Tragedy: { icon: 'drama-masks', name: 'Tragedy' },
    Transportation: { icon: 'bike', name: 'Transportation' },
    Travel: { icon: 'airplane', name: 'Travel' },
    'U.S. News': { icon: 'star-circle', name: 'U.S. News' },
    Weather: { icon: 'weather-partly-cloudy', name: 'Weather' },
    Wildlife: { icon: 'rabbit', name: 'Wildlife' },
    'World News': { icon: 'earth', name: 'World News' },
  };
  
  public static async initCategories() {
    for (const category of Object.values(this.CATEGORIES)) {
      await this.upsert(category);
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare icon: string;
  
}