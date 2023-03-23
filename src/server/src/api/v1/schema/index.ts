import {
  Alias,
  Article,
  ArticleInteraction,
  Credential,
  Job,
  Media,
  Newsletter,
  Outlet,
  Queue,
  RefArticleMedia,
  RefArticleSource,
  RefArticleTopic,
  RefOutletMedia,
  RefSourceMedia,
  RefSourceTopic,
  RefTopicMedia,
  RefUserRole,
  Role,
  Source,
  SourceInteraction,
  Subscription,
  Topic,
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
  Outlet.hasMany(RefOutletMedia, { foreignKey: 'outletId' });
  RefOutletMedia.belongsTo(Media, { foreignKey: 'mediaId' });
  // topics
  Topic.hasMany(RefTopicMedia, { foreignKey: 'topicId' });
  RefTopicMedia.belongsTo(Media, { foreignKey: 'mediaId' });
  
  // sources
  Source.hasMany(RefSourceMedia, { foreignKey: 'sourceId' });
  RefSourceMedia.belongsTo(Media, { foreignKey: 'mediaId' });
  Source.belongsTo(Outlet, { foreignKey: 'outletId' });
  Source.hasOne(RefSourceTopic, { foreignKey: 'sourceId' });
  Topic.hasMany(RefSourceTopic, { foreignKey: 'topicId' });
  Source.hasMany(SourceInteraction, { foreignKey: 'targetId' });
  
  // articles
  Article.hasMany(RefArticleMedia, { foreignKey: 'articleId' });
  RefArticleMedia.belongsTo(Media, { foreignKey: 'mediaId' });
  Article.hasOne(RefArticleTopic, { foreignKey: 'articleId' });
  Topic.hasMany(RefArticleTopic, { foreignKey: 'topicId' });
  Article.hasMany(RefArticleSource, { foreignKey: 'articleId' });
  Source.hasMany(RefArticleSource, { foreignKey: 'sourceId' });
  Source.belongsToMany(Article, {
    foreignKey: 'sourceId', otherKey: 'articleId', through: RefArticleSource, 
  });
  Article.hasMany(ArticleInteraction, { foreignKey: 'targetId' });
  
  // queues
  Queue.hasMany(Job, {
    foreignKey: 'queue',
    sourceKey: 'name',
  });
}