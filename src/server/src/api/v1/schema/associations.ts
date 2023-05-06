import {
  Alias,
  Category,
  Credential,
  Job,
  Outlet,
  Queue,
  RefUserRole,
  Role,
  Service,
  ServiceStatus,
  Summary,
  SummaryInteraction,
  SummarySentiment,
  SummarySentimentToken,
  User,
  UserMetadata,
  Worker,
} from './models';

export function makeAssociations() {
  
  // System
  ServiceStatus.belongsTo(Service, { 
    as: 'status',
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

  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });

  SummarySentiment.belongsTo(Summary, { foreignKey: 'parentId' });
  Summary.hasMany(SummarySentiment, { foreignKey: 'parentId' });

  SummarySentimentToken.belongsTo(SummarySentiment, { foreignKey: 'parentId' });
  SummarySentiment.hasMany(SummarySentimentToken, { foreignKey: 'parentId' });
  
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