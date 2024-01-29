#!/usr/bin/env ts-node

import 'dotenv/config';

import { 
  Category,
  CategoryInteraction,
  InteractionType,
  Publisher,
  PublisherInteraction,
  SummaryInteraction,
  UserMetadata,
} from '../src/api/v1/schema';
import { DBService } from '../src/services';

async function migratePublishers(
  key: string, 
  type: InteractionType 
) {
  console.log(`migrating ${key}`);
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const publishers = typeof row.value === 'string' ? JSON.parse(row.value) as string[] : Array.isArray(row.value) ? Object.values(row.value) as string[] : Object.keys(row.value);
    for (const pub of publishers) {
      const publisher = await Publisher.findOne({ where: { name: pub } });
      if (!publisher) {
        continue;
      }
      const interaction = await PublisherInteraction.findOne({
        where: {
          revert: false,
          targetId: publisher.id,
          type,
          userId,
        },
      });
      if (interaction) {
        continue;
      }
      console.log(`creating ${type} interaction for ${userId} with ${pub}`);
      await PublisherInteraction.create({
        targetId: publisher.id,
        type,
        userId,
      });
    }
  }
}

async function migrateCategories(
  key: string, 
  type: InteractionType 
) {
  console.log(`migrating ${key}`);
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const categories = typeof row.value === 'string' ? JSON.parse(row.value) as string[] : Array.isArray(row.value) ? Object.values(row.value) as string[] : Object.keys(row.value);
    for (const cat of categories) {
      const category = await Category.findOne({ where: { name: cat } });
      if (!category) {
        continue;
      }
      const interaction = await CategoryInteraction.findOne({
        where: {
          revert: false,
          targetId: category.id,
          type,
          userId,
        },
      });
      if (interaction) {
        continue;
      }
      console.log(`creating ${type} interaction for ${userId} with ${cat}`);
      await CategoryInteraction.create({
        targetId: category.id,
        type,
        userId,
      });
    }
  }
}

async function migrateSummaries(
  key: string, 
  type: InteractionType 
) {
  console.log(`migrating ${key}`);
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const summaries = typeof row.value === 'string' ? (JSON.parse(row.value) as string[]).map((k) => parseInt(k)) : Array.isArray(row.value) ? Object.values(row.value) as number[] : Object.keys(row.value).map(k => parseInt(k, 10));
    for (const s of summaries) {
      const interaction = await SummaryInteraction.findOne({
        where: {
          revert: false,
          targetId: s,
          type,
          userId,
        },
      });
      if (interaction) {
        continue;
      }
      console.log(`creating ${type} interaction for ${userId} with ${s}`);
      await SummaryInteraction.create({
        targetId: s,
        type,
        userId,
      });
    }
  }
}

async function main() {
  await DBService.prepare();
  await Publisher.prepare();
  await migratePublishers('followedPublishers', 'follow');
  console.log('migrated followedPublishers');
  await migratePublishers('favoritedPublishers', 'favorite');
  console.log('migrated favoritedPublishers');
  await migratePublishers('excludedPublishers', 'hide');
  console.log('migrated excludedPublishers');
  await migrateCategories('followedCategories', 'follow');
  console.log('migrated followedCategories');
  await migrateCategories('favoritedCategories', 'favorite');
  console.log('migrated favoritedCategories');
  await migrateCategories('excludedCategories', 'hide');
  console.log('migrated excludedCategories');
  await migrateSummaries('bookmarkedSummaries', 'bookmark');
  console.log('migrated bookmarkedSummaries');
  await migrateSummaries('readSummaries', 'read');
  console.log('migrated readSummaries');
  await migrateSummaries('removedSummaries', 'hide');
  console.log('migrated removedSummaries');
}

main();