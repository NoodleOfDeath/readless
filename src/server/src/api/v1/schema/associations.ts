import sql from 'sequelize';

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
  SummaryToken,
  User,
  UserMetadata,
  Worker,
} from './models';
import { 
  PUBLIC_CATEGORY_ATTRIBUTES,
  PUBLIC_OUTLET_ATTRIBUTES,
  PUBLIC_SENTIMENT_ATTRIBUTES,
  PUBLIC_SENTIMENT_TOKEN_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE,
  PUBLIC_SUMMARY_TOKEN_ATTRIBUTES, 
} from './types';

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
  
  SummaryToken.belongsTo(Summary, { 
    as: 'summary',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummaryToken, {
    as: 'tokens',
    foreignKey: 'parentId',
  });
  
  SummarySentiment.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'parentId',
  });
  Summary.hasMany(SummarySentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
  });

  SummarySentimentToken.belongsTo(SummarySentiment, { 
    as: 'sentiment',
    foreignKey: 'parentId',
  });
  SummarySentiment.hasMany(SummarySentimentToken, {
    as: 'tokens',
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

  Outlet.addScope('raw', { attributes: [...PUBLIC_OUTLET_ATTRIBUTES] });
  
  Outlet.addScope(
    'public', 
    {
      attributes: {
        exclude: ['selectors', 'maxAge', 'fetchPolicy', 'timezone', 'updatedAt', 'deletedAt'],
        include: [
          [sql.literal(`(
            SELECT AVG(summary_sentiments.score) as sentiment
            FROM outlets
            LEFT JOIN summaries ON summaries."outletId" = outlet.id
            AND summaries."deletedAt" IS NULL
            LEFT JOIN summary_sentiments ON summary_sentiments."parentId" = summaries.id
            AND summary_sentiments."deletedAt" IS NULL
            WHERE outlet.id = outlets.id
          )`), 'sentiment'],
        ],
      },
      group: ['outlet.id', 'outlet.name', 'outlet."displayName"', 'outlet.description'],
    }
  );
  
  Category.addScope('raw', { attributes: [...PUBLIC_CATEGORY_ATTRIBUTES] });
  
  Category.addScope(
    'public', 
    {
      attributes: {
        exclude: ['updatedAt', 'deletedAt'],
        include: [
          [sql.literal(`(
          SELECT avg(a.sentiment) as sentiment FROM (
              SELECT AVG(summary_sentiments.score) as sentiment FROM categories
              LEFT JOIN summaries ON summaries."categoryId" = category.id
              AND summaries."deletedAt" IS NULL
              LEFT JOIN summary_sentiments ON summary_sentiments."parentId" = summaries.id
              AND summary_sentiments."deletedAt" IS NULL
              WHERE category.id = categories.id
            ) a
          )`), 'sentiment'],
        ],
      },
      group: ['category.id', 'category.name', 'category."displayName"', 'category.icon'],
    }
  );
  
  SummaryToken.addScope('raw', { attributes: [...PUBLIC_SUMMARY_TOKEN_ATTRIBUTES] });
  
  SummarySentiment.addScope('raw', { attributes: [...PUBLIC_SENTIMENT_ATTRIBUTES] });
  
  SummarySentimentToken.addScope('raw', { attributes: [...PUBLIC_SENTIMENT_TOKEN_ATTRIBUTES] });

  Summary.addScope('raw', { attributes: [...PUBLIC_SUMMARY_ATTRIBUTES] });

  Summary.addScope('conservative', {
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE],
    include: [
      Outlet.scope('raw'),
      Category.scope('raw'),
      { 
        as: 'sentiments', 
        include: [{ 
          as: 'tokens', 
          model: SummarySentimentToken.scope('raw'),
        }], 
        model: SummarySentiment.scope('raw'),
      },
    ],
  });
  
  Summary.addScope('public', {
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES],
    include: [
      Outlet.scope('raw'),
      Category.scope('raw'),
      { 
        as: 'sentiments', 
        include: [{ 
          as: 'tokens', 
          model: SummarySentimentToken.scope('raw'),
        }], 
        model: SummarySentiment.scope('raw'),
      },
    ],
  });
  
}
