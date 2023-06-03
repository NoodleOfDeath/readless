import {
  Alias,
  Category,
  Credential,
  Job,
  Message,
  Outlet,
  Queue,
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
  PUBLIC_MESSAGE_ATTRIBUTES,
  PUBLIC_OUTLET_ATTRIBUTES,
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

  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });
  
  SummaryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
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

}
