import { Department } from '@service/value';
import { index, integer, jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const department = pgEnum('department', [
  Department.Anime,
  Department.MangaAndNovel,
  Department.Game,
  Department.TVAnime,
  Department.NonTVAnime,
  Department.Manga,
  Department.Novel,
]);

export const ceremony = pgTable('ceremony', {
  year: integer('year').primaryKey(),
  departments: jsonb('departments').notNull().default([]).$type<Department[]>(),
  nominationStartAt: timestamp('nomination_start_at').notNull(),
  votingStartAt: timestamp('voting_start_at').notNull(),
  awardStartAt: timestamp('award_start_at').notNull(),
});

export const work = pgTable('work', {
  id: serial('id').primaryKey(),
  year: integer('year')
    .notNull()
    .references(() => ceremony.year),
  department: department('department').notNull(),
  ranking: integer('ranking'),
});

export const nameType = pgEnum('name_type', ['main', 'origin', 'alias']);

export const workName = pgTable(
  'work_name',
  {
    id: serial('id').primaryKey(),
    workId: integer('work_id')
      .notNull()
      .references(() => work.id),
    name: text('name').notNull().unique(),
    type: nameType('type').notNull(),
  },
  (table) => {
    return {
      workIdx: index('work_name_work_id_idx').on(table.workId),
    };
  },
);

export const voter = pgTable('voter', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  salt: text('salt'),
  passwordHash: text('password_hash'),
});

export const vote = pgTable(
  'vote',
  {
    id: serial('id').primaryKey(),
    year: integer('year')
      .notNull()
      .references(() => ceremony.year),
    voterId: integer('voter_id')
      .notNull()
      .references(() => voter.id),
    department: department('department').notNull(),
  },
  (table) => {
    return {
      voterIdx: index('vote_voter_id_idx').on(table.voterId),
      departmentIdx: index('vote_year_department_idx').on(table.year, table.department),
    };
  },
);

export const voteToWork = pgTable(
  'vote_to_work',
  {
    voteId: integer('vote_id')
      .notNull()
      .references(() => vote.id),
    workId: integer('work_id')
      .notNull()
      .references(() => work.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.voteId, table.workId] }), // index vote_id, [work_id]
      workIdx: index('vote_to_work_work_id_idx').on(table.workId), // index work_id
    };
  },
);
