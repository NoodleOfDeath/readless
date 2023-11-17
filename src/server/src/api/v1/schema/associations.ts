import {
  Alias,
  Category,
  CategoryInteraction,
  CategoryTranslation,
  Credential,
  IapVoucher,
  Job,
  Locale,
  Message,
  Publisher,
  PublisherInteraction,
  PublisherTranslation,
  Queue,
  Recap,
  RecapInteraction,
  RecapMedia,
  RecapSummary,
  RecapTranslation,
  RefUserRole,
  Role,
  SentimentMethod,
  Service,
  ServiceStatus,
  Subscription,
  Summary,
  SummaryCategory,
  SummaryInteraction,
  SummaryMedia,
  SummaryRelation,
  SummarySentiment,
  SummaryTranslation,
  User,
  UserMetadata,
  Worker,
} from './models';
import { 
  PUBLIC_CATEGORY_ATTRIBUTES,
  PUBLIC_CATEGORY_TRANSLATION_ATTRIBUTES,
  PUBLIC_IAP_VOUCHER_ATTRIBUTES,
  PUBLIC_MESSAGE_ATTRIBUTES,
  PUBLIC_PUBLISHER_ATTRIBUTES,
  PUBLIC_PUBLISHER_TRANSLATION_ATTRIBUTES,
  PUBLIC_RECAP_ATTRIBUTES,
  PUBLIC_RECAP_MEDIA_ATTRIBUTES, 
  PUBLIC_RECAP_TRANSLATION_ATTRIBUTES,
  PUBLIC_SENTIMENT_ATTRIBUTES, 
  PUBLIC_SUBSCRIPTION_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES,
  PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE,
  PUBLIC_SUMMARY_MEDIA_ATTRIBUTES, 
  PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES,
} from './types';

export function makeAssociations() {

  // system associations
  
  ServiceStatus.belongsTo(Service, {
    foreignKey: 'serviceId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Service.hasMany(ServiceStatus, {
    foreignKey: 'serviceId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  // user/auth associations
  
  Alias.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(Alias, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  UserMetadata.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(UserMetadata, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  RefUserRole.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(RefUserRole, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  RefUserRole.belongsTo(Role, {
    foreignKey: 'roleId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Role.hasMany(RefUserRole, {
    foreignKey: 'roleId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  
  Credential.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(Credential, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  
  // publisher associations
  
  PublisherInteraction.belongsTo(Publisher, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Publisher.hasMany(PublisherInteraction, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  PublisherInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(PublisherInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  PublisherTranslation.belongsTo(Publisher, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Publisher.hasMany(PublisherTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(PublisherTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // category associations
  
  CategoryInteraction.belongsTo(Category, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Category.hasMany(CategoryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  CategoryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(CategoryInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  CategoryTranslation.belongsTo(Category, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Category.hasMany(CategoryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(CategoryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // summary associations
  
  Summary.belongsTo(Publisher, { foreignKey: 'publisherId' });
  Publisher.hasMany(Summary, { 
    foreignKey: 'publisherId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  Summary.belongsToMany(Category, {
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: SummaryCategory,
  });
  SummaryCategory.hasMany(Summary, {
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'parentId',
  });
  Category.hasMany(Summary, { 
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  SentimentMethod.hasMany(SummarySentiment, { 
    foreignKey: 'method', 
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  
  SummarySentiment.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummarySentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  SummaryTranslation.belongsTo(Summary, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(SummaryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  SummaryMedia.belongsTo(Summary, { 
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'sibling',
    foreignKey: 'siblingId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'sibling',
    foreignKey: 'siblingId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  SummaryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(SummaryInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // recap associations
  
  RecapSummary.belongsTo(Summary, {
    as: 'child',
    foreignKey: 'summaryId',
  });
  Summary.hasMany(RecapSummary, {
    as: 'child',
    foreignKey: 'summaryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  RecapSummary.belongsTo(Recap, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapSummary, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.belongsToMany(Recap, {
    as: 'summaries',
    foreignKey: 'summaryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: RecapSummary,
  });
  Recap.belongsToMany(Summary, {
    as: 'summaries',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: RecapSummary,
  });
  
  RecapTranslation.belongsTo(Recap, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(RecapTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  RecapMedia.belongsTo(Recap, { 
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  RecapInteraction.belongsTo(Recap, { foreignKey: 'targetId' });
  Recap.hasMany(RecapInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  RecapInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // queues
  Queue.hasMany(Job, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  Queue.hasMany(Worker, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  Worker.hasMany(Job, {
    foreignKey:{
      allowNull: true,
      name: 'lockedBy',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
}

export function addScopes() {
  
  Service.addScope('public', {
    include: [
      {
        as: 'statuses',
        model: ServiceStatus,
      },
    ],
  });
  
  Message.addScope('public', { attributes: [...PUBLIC_MESSAGE_ATTRIBUTES] });

  Publisher.addScope('defaultScope', { where: { disabled: null } });
  Publisher.addScope('public', { 
    attributes: [...PUBLIC_PUBLISHER_ATTRIBUTES],
    where: { disabled: null },
  });
  
  PublisherTranslation.addScope('public', { attributes: [...PUBLIC_PUBLISHER_TRANSLATION_ATTRIBUTES] });
  
  Category.addScope('defaultScope', { where: { disabled: null } });
  Category.addScope('public', {
    attributes: [...PUBLIC_CATEGORY_ATTRIBUTES],
    where: { disabled: null },
  });
  
  CategoryTranslation.addScope('public', { attributes: [...PUBLIC_CATEGORY_TRANSLATION_ATTRIBUTES] });
  
  SummarySentiment.addScope('public', { attributes: [...PUBLIC_SENTIMENT_ATTRIBUTES] });

  Summary.addScope('minimal', { attributes: ['id', 'updatedAt'] });

  Summary.addScope('public', { 
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES],
    include: [
      Publisher.scope('public'),
      Category.scope('public'),
    ],
  });
  Summary.addScope('conservative', {
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE],
    include: [
      Publisher.scope('public'),
      Category.scope('public'),
    ],
  });
  
  SummaryTranslation.addScope('public', { attributes: [...PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES] });
  
  SummaryMedia.addScope('public', { attributes: [...PUBLIC_SUMMARY_MEDIA_ATTRIBUTES] });
  
  Recap.addScope('public', { attributes: [...PUBLIC_RECAP_ATTRIBUTES] });
  
  RecapTranslation.addScope('public', { attributes: [...PUBLIC_RECAP_TRANSLATION_ATTRIBUTES] });
  
  RecapMedia.addScope('public', { attributes: [...PUBLIC_RECAP_MEDIA_ATTRIBUTES] });
  
  Subscription.addScope('public', { attributes: [...PUBLIC_SUBSCRIPTION_ATTRIBUTES] });

  IapVoucher.addScope('public', { attributes: [...PUBLIC_IAP_VOUCHER_ATTRIBUTES] });

}
