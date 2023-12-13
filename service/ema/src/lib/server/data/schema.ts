import { Department } from '$lib/domain/value';
import { index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
    department: department('department').notNull(),
    name: text('name').notNull(),
    type: nameType('type').notNull(),
  },
  (table) => {
    return {
      nameIdx: index('work_name_name_idx').on(table.name, table.department),
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

export const rankingInVote = pgTable(
  'ranking_in_vote',
  {
    id: serial('id').primaryKey(),
    voteId: integer('vote_id')
      .notNull()
      .references(() => vote.id),
    workId: integer('work_id')
      .notNull()
      .references(() => work.id),
    ranking: integer('ranking').notNull(),
  },
  (table) => {
    return {
      voteIdIdx: index('ranking_in_vote_vote_id_idx').on(table.voteId),
      workIdIdx: index('ranking_in_vote_work_id_idx').on(table.workId),
    };
  },
);
