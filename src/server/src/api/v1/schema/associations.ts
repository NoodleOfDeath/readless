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
  User.hasMany(UserMetadata, { foreignKey: 'userId' });
  User.hasMany(RefUserRole, { foreignKey: 'userId' });
  RefUserRole.belongsTo(Role, { foreignKey: 'roleId' });
  
  // auth
  User.hasMany(Credential, { foreignKey: 'userId' });
  Credential.belongsTo(User, { foreignKey: 'userId' });
  
  // summaries
  Summary.belongsTo(Category, {
    as: 'summaryCategory',
    foreignKey: 'category',
    targetKey: 'name',
  });
  Summary.belongsTo(Outlet, { foreignKey: 'outletId' });
  Summary.hasMany(SummaryInteraction, { foreignKey: 'targetId' });

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