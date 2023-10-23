import {
  Alias,
  Category,
  CategoryTranslation,
  Credential,
  IapVoucher,
  Job,
  Locale,
  Message,
  Publisher,
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
  
  User.hasMany(Alias, { foreignKey: 'userId' });
  Alias.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(UserMetadata, { foreignKey: 'userId' });
  UserMetadata.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(RefUserRole, { foreignKey: 'userId' });
  RefUserRole.belongsTo(User, { foreignKey: 'userId' });

  Role.hasMany(RefUserRole, { foreignKey: 'roleId' });
  RefUserRole.belongsTo(Role, { foreignKey: 'roleId' });
  
  User.hasMany(Credential, { foreignKey: 'userId' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  
  // publisher associations
  
  PublisherTranslation.belongsTo(Publisher, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Publisher.hasMany(PublisherTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
  });
  
  Locale.hasMany(PublisherTranslation, { 
    foreignKey: 'locale',
    sourceKey: 'code',
  });
  
  // category associations
  
  CategoryTranslation.belongsTo(Category, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Category.hasMany(CategoryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
  });
  
  Locale.hasMany(CategoryTranslation, { 
    foreignKey: 'locale',
    sourceKey: 'code',
  });
  
  // summary associations
  
  Summary.belongsTo(Publisher, { foreignKey: 'publisherId' });
  Publisher.hasMany(Summary, { foreignKey: 'publisherId' });

  Summary.belongsToMany(Category, {
    foreignKey: 'parentId',
    through: SummaryCategory,
  });
  SummaryCategory.hasMany(Summary, {
    foreignKey: 'categoryId',
    sourceKey: 'parentId',
  });
  Category.hasMany(Summary, { foreignKey: 'categoryId' });
  
  SentimentMethod.hasMany(SummarySentiment, { foreignKey: 'method', sourceKey: 'name' });
  
  SummarySentiment.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummarySentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
  });
  
  SummaryTranslation.belongsTo(Summary, { 
    as: 'translations',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
  });
  
  Locale.hasMany(SummaryTranslation, { 
    foreignKey: 'locale',
    sourceKey: 'code',
  });
  
  SummaryMedia.belongsTo(Summary, { 
    as: 'media',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryMedia, {
    as: 'media',
    foreignKey: 'parentId',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'parent',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'parent',
    foreignKey: 'parentId',
  });
  
  SummaryRelation.belongsTo(Summary, { 
    as: 'sibling',
    foreignKey: 'siblingId',
  });
  Summary.hasMany(SummaryRelation, {
    as: 'sibling',
    foreignKey: 'siblingId',
  });

  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });
  
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
  });
  
  RecapSummary.belongsTo(Recap, {
    as: 'parent',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapSummary, {
    as: 'parent',
    foreignKey: 'parentId',
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
  });
  
  Locale.hasMany(RecapTranslation, { 
    foreignKey: 'locale',
    sourceKey: 'code',
  });
  
  RecapMedia.belongsTo(Recap, { 
    as: 'media',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapMedia, {
    as: 'media',
    foreignKey: 'parentId',
  });
  
  RecapInteraction.belongsTo(Recap, { foreignKey: 'targetId' });
  Recap.hasMany(RecapInteraction, { foreignKey: 'targetId' });
  
  RecapInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
  });
  
  // queues
  Queue.hasMany(Job, {
    foreignKey: 'queue',
    sourceKey: 'name',
  });
  Queue.hasMany(Worker, {
    foreignKey: 'queue',
    sourceKey: 'name',
  });
  Worker.hasMany(Job, {
    foreignKey:{
      allowNull: true,
      name: 'lockedBy',
    },
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
