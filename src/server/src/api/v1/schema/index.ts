import {
  Alias,
  Category,
  CategoryMedia,
  Credential,
  Job,
  Newsletter,
  Outlet,
  OutletMedia,
  Queue,
  RefUserRole,
  Role,
  Subscription,
  Summary,
  SummaryInteraction,
  SummaryInteractionMedia,
  SummaryMedia,
  User,
  UserMetadata,
  Worker,
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
  
  // categories
  Category.hasMany(CategoryMedia, { foreignKey: 'parentId' });
  
  // outlets
  Outlet.hasMany(OutletMedia, { foreignKey: 'parentId' });
  
  // summaries
  Summary.hasMany(SummaryMedia, { foreignKey: 'parentId' });
  Summary.belongsTo(Category, {
    as: 'summaryCategory',
    foreignKey: 'category',
    targetKey: 'name',
  });
  Summary.belongsTo(Outlet, { foreignKey: 'outletId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });

  SummaryInteraction.hasMany(SummaryInteractionMedia, { foreignKey: 'parentId' });
  SummaryInteraction.belongsTo(User, {
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