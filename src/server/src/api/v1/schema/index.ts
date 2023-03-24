import {
  Alias,
  Article,
  ArticleInteraction,
  ArticleInteractionMedia,
  ArticleMedia,
  Credential,
  Job,
  Newsletter,
  Outlet,
  OutletMedia,
  Queue,
  RefArticleSummary,
  RefArticleTopic,
  RefSummaryTopic,
  RefUserRole,
  Role,
  Subscription,
  Summary,
  SummaryInteraction,
  SummaryInteractionMedia,
  SummaryMedia,
  Topic,
  TopicMedia,
  User,
  UserMetadata,
} from './models';

export * from './models';
export * from './types';

export function makeAssociations() {

  // users
  User.hasMany(Alias, { foreignKey: 'userId' });
  User.hasMany(UserMetadata, { foreignKey: 'userId' });
  User.hasMany(RefUserRole, { foreignKey: 'userId' });
  RefUserRole.belongsTo(Role, { foreignKey: 'roleId' });
  
  // auth
  User.hasMany(Credential, { foreignKey: 'userId' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  
  // newsletter
  Newsletter.hasMany(Subscription, { foreignKey: 'newsletterId' });
  Subscription.belongsTo(Newsletter, { foreignKey: 'newsletterId' });
  
  // outlets
  Outlet.hasMany(OutletMedia, { foreignKey: 'parentId' });
  
  // topics
  Topic.hasMany(TopicMedia, { foreignKey: 'parentId' });
  
  // sources
  Summary.hasMany(SummaryMedia, { foreignKey: 'parentId' });
  Summary.belongsTo(Outlet, { foreignKey: 'outletId' });
  Summary.hasOne(RefSummaryTopic, { foreignKey: 'sourceId' });
  Topic.hasMany(RefSummaryTopic, { foreignKey: 'topicId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });
  SummaryInteraction.hasMany(SummaryInteractionMedia, { foreignKey: 'parentId' });
  
  // articles
  Article.hasMany(ArticleMedia, { foreignKey: 'parentId' });
  Article.hasOne(RefArticleTopic, { foreignKey: 'articleId' });
  Topic.hasMany(RefArticleTopic, { foreignKey: 'topicId' });
  Article.hasMany(RefArticleSummary, { foreignKey: 'articleId' });
  Summary.hasMany(RefArticleSummary, { foreignKey: 'sourceId' });
  Summary.belongsToMany(Article, {
    foreignKey: 'sourceId', otherKey: 'articleId', through: RefArticleSummary, 
  });
  Article.hasMany(ArticleInteraction, { foreignKey: 'targetId' });
  ArticleInteraction.hasMany(ArticleInteractionMedia, { foreignKey: 'parentId' });
  
  // queues
  Queue.hasMany(Job, {
    foreignKey: 'queue',
    sourceKey: 'name',
  });
}