ALTER TABLE "vote" DROP CONSTRAINT "vote_year_department_vote_idx";--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_year_department_voter_idx" UNIQUE("year","department","voter_id");