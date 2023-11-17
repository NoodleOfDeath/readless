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
  
  ServiceStatus.belongsTo(Service, { foreignKey: 'serviceId' });
  Service.hasMany(ServiceStatus, { foreignKey: 'serviceId' });

  // user/auth associations
  
  User.hasMany(Alias, { foreignKey: 'userId', onDelete: 'cascade' });
  Alias.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(UserMetadata, { foreignKey: 'userId', onDelete: 'cascade' });
  UserMetadata.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(RefUserRole, { foreignKey: 'userId', onDelete: 'cascade' });
  RefUserRole.belongsTo(User, { foreignKey: 'userId' });

  Role.hasMany(RefUserRole, { foreignKey: 'roleId' });
  RefUserRole.belongsTo(Role, { foreignKey: 'roleId' });
  
  User.hasMany(Credential, { foreignKey: 'userId', onDelete: 'cascade' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  
  // publisher associations
  
  PublisherInteraction.belongsTo(Publisher, { foreignKey: 'targetId' });
  Publisher.hasMany(PublisherInteraction, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
  });
  
  PublisherInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
  });
  
  PublisherTranslation.belongsTo(Publisher, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Publisher.hasMany(PublisherTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  Locale.hasMany(PublisherTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    sourceKey: 'code',
  });
  
  // category associations
  
  CategoryInteraction.belongsTo(Category, { foreignKey: 'targetId' });
  Category.hasMany(CategoryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
  });
  
  CategoryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
  });
  
  CategoryTranslation.belongsTo(Category, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Category.hasMany(CategoryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  Locale.hasMany(CategoryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    sourceKey: 'code',
  });
  
  // summary associations
  
  Summary.belongsTo(Publisher, { foreignKey: 'publisherId' });
  Publisher.hasMany(Summary, { 
    foreignKey: 'publisherId',
    onDelete: 'cascade',
  });

  Summary.belongsToMany(Category, {
    foreignKey: 'parentId',
    through: SummaryCategory,
  });
  SummaryCategory.hasMany(Summary, {
    foreignKey: 'categoryId',
    sourceKey: 'parentId',
  });
  Category.hasMany(Summary, { 
    foreignKey: 'categoryId',
    onDelete: 'cascade',
  });
  
  SentimentMethod.hasMany(SummarySentiment, { 
    foreignKey: 'method', 
    onDelete: 'cascade',
    sourceKey: 'name',
  });
  
  SummarySentiment.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummarySentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  SummaryTranslation.belongsTo(Summary, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  Locale.hasMany(SummaryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    sourceKey: 'code',
  });
  
  SummaryMedia.belongsTo(Summary, { 
    as: 'media',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'parent',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'sibling',
    foreignKey: 'siblingId',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'sibling',
    foreignKey: 'siblingId',
    onDelete: 'cascade',
  });

  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
  });
  
  SummaryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
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
  });
  
  RecapSummary.belongsTo(Recap, {
    as: 'parent',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapSummary, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  Summary.belongsToMany(Recap, {
    as: 'summaries',
    foreignKey: 'summaryId',
    through: RecapSummary,
  });
  Recap.belongsToMany(Summary, {
    as: 'summaries',
    foreignKey: 'parentId',
    through: RecapSummary,
  });
  
  RecapTranslation.belongsTo(Recap, {
    as: 'translations',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  Locale.hasMany(RecapTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    sourceKey: 'code',
  });
  
  RecapMedia.belongsTo(Recap, { 
    as: 'media',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
  });
  
  RecapInteraction.belongsTo(Recap, { foreignKey: 'targetId' });
  Recap.hasMany(RecapInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
  });
  
  RecapInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
  });
  
  // queues
  Queue.hasMany(Job, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    sourceKey: 'name',
  });
  Queue.hasMany(Worker, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    sourceKey: 'name',
  });
  Worker.hasMany(Job, {
    foreignKey:{
      allowNull: true,
      name: 'lockedBy',
    },
    onDelete: 'cascade',
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
