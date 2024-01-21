import { sql } from 'drizzle-orm';
import { Department } from '../../domain/value';
import { index, unique, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
  departments: department('departments').array().notNull(),
  nominationStartAt: timestamp('nomination_start_at').notNull(),
  votingStartAt: timestamp('voting_start_at').notNull(),
  awardStartAt: timestamp('award_start_at').notNull(),
});

export const work = pgTable(
  'work',
  {
    id: serial('id')
      .primaryKey()
      .default(sql`nextval('work_id_seq')`),
    year: integer('year')
      .notNull()
      .references(() => ceremony.year),
    department: department('department').notNull(),
    name: text('name').notNull(),
    originName: text('origin_name'),
    aliases: text('aliases').array(),
    ranking: integer('ranking'),
  },
  (table) => {
    return {
      nameIdx: index('work_name_idx').on(table.year, table.department, table.name),
      originNameIdx: index('work_origin_name_idx').on(table.year, table.department, table.originName),
      aliasesIdx: index('work_aliases_idx').on(table.year, table.department, table.aliases),
    };
  },
);

export const voter = pgTable('voter', {
  id: serial('id')
    .primaryKey()
    .default(sql`nextval('voter_id_seq')`),
  name: text('name').notNull().unique(),
  passwordHash: text('password_hash'),
});

export const vote = pgTable(
  'vote',
  {
    id: serial('id')
      .primaryKey()
      .default(sql`nextval('vote_id_seq')`),
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
      yearDepartmentVoteIdx: unique('vote_year_department_voter_idx').on(table.year, table.department, table.voterId),
    };
  },
);

export const rankingInVote = pgTable(
  'ranking_in_vote',
  {
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
      pk: primaryKey({ columns: [table.voteId, table.workId] }),
      workIdIdx: index('ranking_in_vote_work_id_idx').on(table.workId),
    };
  },
);
