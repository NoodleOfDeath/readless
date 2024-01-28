#!/usr/bin/env ts-node

import 'dotenv/config';

import { 
  CategoryInteraction,
  InteractionType,
  PublisherInteraction,
  SummaryInteraction,
  UserMetadata,
} from '../src/api/v1/schema';
import { DBService } from '../src/services';

async function migratePublishers(
  key: string, 
  type: InteractionType, 
  userId: number,
) {
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const publishers = Array.isArray(row.value) ? Object.values(row.value) : Object.keys(row.value);
    for (pub of publishers) {
      const interaction = await PublisherInteraction.findOne({
        revert: false,
        targetId: pub,
        type,
        userId,
      });
      if (interaction) {
        continue;
      }
      await PublisherInteraction.create({
        targetId: pub,
        type,
        userId,
      });
    }
  }
}

async function migrateCategories(
  key: string, 
  type: InteractionType, 
) {
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const categories = Array.isArray(row.value) ? Object.values(row.value) : Object.keys(row.value);
    for (cat of categories) {
      const interaction = await CategoryInteraction.findOne({
        revert: false,
        targetId: cat,
        type,
        userId,
      });
      if (interaction) {
        continue;
      }
      await CategoryInteraction.create({
        targetId: cat,
        type,
        userId,
      });
    }
  }
}

async function migrateSummaries(
  key: string, 
  type: InteractionType, 
  userId: number,
) {
  const rows = await UserMetadata.findAll({ where: { key } });
  for (const row of rows) {
    const userId = row.userId;
    const summaries = Array.isArray(row.value) ? Object.values(row.value) : Object.keys(row.value);
    for (s of summaries) {
      const interaction = await SummaryInteraction.findOne({
        revert: false,
        targetId: s,
        type,
        userId,
      });
      if (interaction) {
        continue;
      }
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
  await migratePublishers('followedPublishers', 'follow');
  await migratePublishers('favoritedPublishers', 'favorite');
  await migratePublishers('excludedPublishers', 'hide');
  await migrateCategories('followedCategories', 'follow');
  await migrateCategories('favoritedCategories', 'favorite');
  await migrateCategories('excludedCategories', 'hide');
  await migrateSummaries('bookmarkedSummaries', 'bookmark');
  await migrateSummaries('readSummaries', 'read');
  await migrateSummaries('removedSummaries', 'hide');
}

main();