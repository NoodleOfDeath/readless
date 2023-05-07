import { 
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { CategoryAttributes, CategoryCreationAttributes } from './Category.types';
import { BaseModel } from '../../base';

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
    art: {
      displayName: 'Art', icon: 'palette', name: 'art', 
    },
    'artificial-intelligence': {
      displayName: 'Artificial Intelligence', icon: 'brain', name: 'artificial-intelligence', 
    },
    automotive: {
      displayName: 'Automotive', icon: 'car', name: 'automotive', 
    },
    books: {
      displayName: 'Books', icon: 'book-open-variant', name: 'books', 
    },
    business: {
      displayName: 'Business', icon: 'domain', name: 'business', 
    },
    crime: {
      displayName: 'Crime', icon: 'police-badge', name: 'crime', 
    },
    cryptocurrency: {
      displayName: 'Cryptocurrency', icon: 'bitcoin', name: 'cryptocurrency', 
    },
    culture: {
      displayName: 'Culture', icon: 'cannabis', name: 'culture', 
    },
    disasters: {
      displayName: 'Disasters', icon: 'weather-tornado', name: 'disasters', 
    },
    economics: {
      displayName: 'Economics', icon: 'cash', name: 'economics', 
    },
    education: {
      displayName: 'Education', icon: 'school', name: 'education', 
    },
    energy: {
      displayName: 'Energy', icon: 'barrel', name: 'energy', 
    },
    entertainment: {
      displayName: 'Entertainment', icon: 'popcorn', name: 'entertainment', 
    },
    environment: {
      displayName: 'Environment', icon: 'sprout', name: 'environment', 
    },
    fashion: {
      displayName: 'Fashion', icon: 'shoe-heel', name: 'fashion', 
    },
    finance: {
      displayName: 'Finance', icon: 'currency-usd', name: 'finance', 
    },
    food: {
      displayName: 'Food', icon: 'food', name: 'food', 
    },
    gaming: {
      displayName: 'Gaming', icon: 'controller-classic', name: 'gaming', 
    },
    geopolitics: {
      displayName: 'Geopolitics', icon: 'handshake', name: 'geopolitics', 
    },
    health: {
      displayName: 'Health', icon: 'weight-lifter', name: 'health', 
    },
    healthcare: {
      displayName: 'Healthcare', icon: 'medical-bag', name: 'healthcare', 
    },
    history: {
      displayName: 'History', icon: 'pillar', name: 'history', 
    },
    'home-improvement': {
      displayName: 'Home Improvement', icon: 'home-heart', name: 'home-improvement', 
    },
    inspiration: {
      displayName: 'Inspiration', icon: 'lightbulb-on', name: 'inspiration', 
    },
    journalism: {
      displayName: 'Journalism', icon: 'feather', name: 'journalism', 
    },
    labor: {
      displayName: 'Labor', icon: 'briefcase', name: 'labor', 
    },
    legal: {
      displayName: 'Legal', icon: 'gavel', name: 'legal', 
    },
    lgbtq: {
      displayName: 'LGBTQ', icon: 'looks', name: 'lgbtq', 
    },
    lifestyle: {
      displayName: 'Lifestyle', icon: 'shoe-sneaker', name: 'lifestyle', 
    },
    media: {
      displayName: 'Media', icon: 'newspaper', name: 'media',
    },
    medicine: {
      displayName: 'Medicine', icon: 'needle', name: 'medicine', 
    },
    music: {
      displayName: 'Music', icon: 'music', name: 'music', 
    },
    obituary: {
      displayName: 'Obituary', icon: 'grave-stone', name: 'obituary', 
    },
    other: {
      displayName: 'Other', icon: 'progress-question', name: 'other', 
    },
    pandemic: {
      displayName: 'Pandemic', icon: 'virus', name: 'pandemic', 
    },
    parenting: {
      displayName: 'Parenting', icon: 'human-male-child', name: 'parenting', 
    },
    pets: {
      displayName: 'Pets', icon: 'dog', name: 'pets', 
    },
    philosophy: {
      displayName: 'Philosophy', icon: 'head-dots-horizontal', name: 'philosophy', 
    },
    politics: {
      displayName: 'Politics', icon: 'bank-outline', name: 'politics', 
    },
    'pop-culture': {
      displayName: 'Pop Culture', icon: 'bullhorn', name: 'pop-culture', 
    },
    productivity: {
      displayName: 'Productivity', icon: 'tools', name: 'productivity', 
    },
    programming: {
      displayName: 'Programming', icon: 'code-tags', name: 'programming',
    },
    'real-estate': {
      displayName: 'Real Estate', icon: 'home-group', name: 'real-estate', 
    },
    religion: {
      displayName: 'Religion', icon: 'cross', name: 'religion', 
    },
    robotics: {
      displayName: 'Robotics', icon: 'robot-industrial', name: 'robotics', 
    },
    royalty: {
      displayName: 'Royalty', icon: 'crown', name: 'royalty', 
    },
    science: {
      displayName: 'Science', icon: 'flask', name: 'science', 
    },
    shopping: {
      displayName: 'Shopping', icon: 'shopping', name: 'shopping', 
    },
    'social-media': {
      displayName: 'Social Media', icon: 'twitter', name: 'social-media',
    },
    space: {
      displayName: 'Space', icon: 'space-station', name: 'space', 
    },
    sports: {
      displayName: 'Sports', icon: 'basketball', name: 'sports', 
    },
    technology: {
      displayName: 'Technology', icon: 'chip', name: 'technology', 
    },
    television: {
      displayName: 'Television', icon: 'television-classic', name: 'television', 
    },
    tragedy: {
      displayName: 'Tragedy', icon: 'drama-masks', name: 'tragedy', 
    },
    transportation: {
      displayName: 'Transportation', icon: 'bike', name: 'transportation', 
    },
    travel: {
      displayName: 'Travel', icon: 'airplane', name: 'travel', 
    },
    'usnews': {
      displayName: 'U.S. News', icon: 'star-circle', name: 'usnews', 
    },
    weather: {
      displayName: 'Weather', icon: 'weather-partly-cloudy', name: 'weather', 
    },
    wildlife: {
      displayName: 'Wildlife', icon: 'rabbit', name: 'wildlife', 
    },
    'world-news': {
      displayName: 'World News', icon: 'earth', name: 'world-news', 
    },
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
  declare displayName: string;
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare icon: string;
  
}