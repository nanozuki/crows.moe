ALTER TABLE "ranking_in_vote" ALTER COLUMN "id" SET DEFAULT nextval('ranking_in_vote_id_seq');--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "id" SET DEFAULT nextval('vote_id_seq');--> statement-breakpoint
ALTER TABLE "voter" ALTER COLUMN "id" SET DEFAULT nextval('voter_id_seq');--> statement-breakpoint
ALTER TABLE "work" ALTER COLUMN "id" SET DEFAULT nextval('work_id_seq');--> statement-breakpoint
ALTER TABLE "voter" DROP COLUMN IF EXISTS "salt";