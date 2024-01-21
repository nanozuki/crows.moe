DROP INDEX IF EXISTS "vote_year_department_idx";--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_year_department_vote_idx" UNIQUE("year","department","voter_id");