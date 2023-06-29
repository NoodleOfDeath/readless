import {
  Alias,
  Category,
  Credential,
  IapVoucher,
  Job,
  Message,
  Outlet,
  Queue,
  Recap,
  RecapInteraction,
  RecapMedia,
  RecapSentiment,
  RecapSummary,
  RecapTranslation,
  RefUserRole,
  Role,
  SentimentMethod,
  Service,
  ServiceStatus,
  Summary,
  SummaryInteraction,
  SummaryMedia,
  SummaryRelation,
  SummarySentiment,
  SummaryToken,
  SummaryTranslation,
  TokenType,
  User,
  UserMetadata,
  Worker,
} from './models';
import { 
  PUBLIC_CATEGORY_ATTRIBUTES,
  PUBLIC_IAP_VOUCHER_ATTRIBUTES,
  PUBLIC_MESSAGE_ATTRIBUTES,
  PUBLIC_OUTLET_ATTRIBUTES,
  PUBLIC_RECAP_ATTRIBUTES,
  PUBLIC_RECAP_MEDIA_ATTRIBUTES, 
  PUBLIC_RECAP_TRANSLATION_ATTRIBUTES,
  PUBLIC_SENTIMENT_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES,
  PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE,
  PUBLIC_SUMMARY_MEDIA_ATTRIBUTES, 
  PUBLIC_SUMMARY_TOKEN_ATTRIBUTES, 
  PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES,
  PUBLIC_TOKEN_TYPE_ATTRIBUTES,
} from './types';

export function makeAssociations() {

  // System
  ServiceStatus.belongsTo(Service, { 
    as: 'statuses',
    foreignKey: 'serviceId',
  });
  Service.hasMany(ServiceStatus, { 
    as: 'statuses',
    foreignKey: 'serviceId',
  });

  // users
  User.hasMany(Alias, { foreignKey: 'userId' });
  Alias.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(UserMetadata, { foreignKey: 'userId' });
  UserMetadata.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(RefUserRole, { foreignKey: 'userId' });
  RefUserRole.belongsTo(User, { foreignKey: 'userId' });

  Role.hasMany(RefUserRole, { foreignKey: 'roleId' });
  RefUserRole.belongsTo(Role, { foreignKey: 'roleId' });
  
  // auth
  User.hasMany(Credential, { foreignKey: 'userId' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  
  // summaries
  Summary.belongsTo(Outlet, { foreignKey: 'outletId' });
  Outlet.hasMany(Summary, { foreignKey: 'outletId' });

  Summary.belongsTo(Category, { foreignKey: 'categoryId' });
  Category.hasMany(Summary, { foreignKey: 'categoryId' });
  
  SummaryToken.belongsTo(Summary, { 
    as: 'summary',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryToken, {
    as: 'tokens',
    foreignKey: 'parentId',
  });

  TokenType.hasMany(SummaryToken, { foreignKey: 'type', sourceKey: 'name' });

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
  
  SentimentMethod.hasMany(RecapSentiment, { foreignKey: 'method', sourceKey: 'name' });
  
  RecapSentiment.belongsTo(Recap, {
    as: 'recap',
    foreignKey: 'parentId',
  });
  Recap.hasMany(RecapSentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
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

  Outlet.addScope('defaultScope', { where: { disabled: null } });
  Outlet.addScope('public', { 
    attributes: [...PUBLIC_OUTLET_ATTRIBUTES],
    where: { disabled: null },
  });
  
  Category.addScope('defaultScope', { where: { disabled: null } });
  Category.addScope('public', {
    attributes: [...PUBLIC_CATEGORY_ATTRIBUTES],
    where: { disabled: null },
  });
  
  SummaryToken.addScope('public', { attributes: [...PUBLIC_SUMMARY_TOKEN_ATTRIBUTES] });
  
  SummarySentiment.addScope('public', { attributes: [...PUBLIC_SENTIMENT_ATTRIBUTES] });

  Summary.addScope('public', { 
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES],
    include: [
      Outlet.scope('public'),
      Category.scope('public'),
    ],
  });
  Summary.addScope('conservative', {
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE],
    include: [
      Outlet.scope('public'),
      Category.scope('public'),
    ],
  });
  
  TokenType.addScope('public', { attributes: [...PUBLIC_TOKEN_TYPE_ATTRIBUTES ] });
  
  SummaryTranslation.addScope('public', { attributes: [...PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES] });
  
  SummaryMedia.addScope('public', { attributes: [...PUBLIC_SUMMARY_MEDIA_ATTRIBUTES] });
  
  RecapSentiment.addScope('public', { attributes: [...PUBLIC_SENTIMENT_ATTRIBUTES] });
  
  Recap.addScope('public', { 
    attributes: [...PUBLIC_RECAP_ATTRIBUTES],
    include: [
      {
        as: 'summaries',
        model: Summary.scope('public'),
      },
    ],
  });
  
  RecapTranslation.addScope('public', { attributes: [...PUBLIC_RECAP_TRANSLATION_ATTRIBUTES] });
  
  RecapMedia.addScope('public', { attributes: [...PUBLIC_RECAP_MEDIA_ATTRIBUTES] });
  
  IapVoucher.addScope('public', { attributes: [...PUBLIC_IAP_VOUCHER_ATTRIBUTES] });

}
