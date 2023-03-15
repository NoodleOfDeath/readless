
import {
  Article, ArticleSource, ArticleTopic, Credential, Media, Newsletter, Outlet, Permission, RefArticleMedia, RefCredentialRole, RefOutletMedia, RefRolePermission, RefSourceMedia, RefSourceTopic, RefTopicMedia, RefUserRole, Role, Source, Subscription, Topic, User, UserAlias, UserMetadata 
} from './models';

export function makeAssociations() {

  // users
  User.hasMany(UserAlias, { foreignKey: 'userId' });
  User.hasMany(UserMetadata, { foreignKey: 'userId' });
  // auth
  User.hasMany(RefUserRole, { foreignKey: 'userId' });
  Role.hasMany(RefUserRole, { foreignKey: 'roleId' });
  Role.belongsToMany(User, {
    through: RefUserRole, foreignKey: 'roleId', otherKey: 'userId'
  });
  User.hasMany(Credential, { foreignKey: 'userId' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  // credentials <- roles
  Credential.hasMany(RefCredentialRole, { foreignKey: 'credentialId' });
  Role.hasMany(RefCredentialRole, { foreignKey: 'roleId' });
  Role.belongsToMany(Credential, {
    through: RefCredentialRole, foreignKey: 'roleId', otherKey: 'credentialId' 
  });
  // roles <- permissions
  Role.hasMany(RefRolePermission, { foreignKey: 'roleId' });
  Permission.hasMany(RefRolePermission, { foreignKey: 'permissionId' });
  Permission.belongsToMany(Role, {
    through: RefRolePermission, foreignKey: 'permissionId', otherKey: 'roleId' 
  });
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
  Source.hasOne(RefSourceTopic, { foreignKey: 'sourceId' });
  Source.belongsTo(Outlet, { foreignKey: 'outletId' });
  Topic.hasMany(RefSourceTopic, { foreignKey: 'topicId' });
  // articles
  Article.hasMany(RefArticleMedia, { foreignKey: 'articleId' });
  RefArticleMedia.belongsTo(Media, { foreignKey: 'mediaId' });
  Article.hasOne(ArticleTopic, { foreignKey: 'articleId' });
  Topic.hasMany(ArticleTopic, { foreignKey: 'topicId' });
  Article.hasMany(ArticleSource, { foreignKey: 'articleId' });
  Source.hasMany(ArticleSource, { foreignKey: 'sourceId' });
  Source.belongsToMany(Article, {
    through: ArticleSource, foreignKey: 'sourceId', otherKey: 'articleId' 
  });
}