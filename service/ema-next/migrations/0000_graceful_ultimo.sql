DO $$ BEGIN
 CREATE TYPE "department" AS ENUM('anime', 'manga-novel', 'game', 'tv-anime', 'non-tv-anime', 'manga', 'novel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ceremony" (
	"year" integer PRIMARY KEY NOT NULL,
	"departments" department[] NOT NULL,
	"nomination_start_at" timestamp NOT NULL,
	"voting_start_at" timestamp NOT NULL,
	"award_start_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ranking_in_vote" (
	"vote_id" integer NOT NULL,
	"work_id" integer NOT NULL,
	"ranking" integer NOT NULL,
	CONSTRAINT ranking_in_vote_vote_id_work_id_pk PRIMARY KEY("vote_id","work_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"voter_id" integer NOT NULL,
	"department" "department" NOT NULL,
	CONSTRAINT "vote_year_department_voter_idx" UNIQUE("year","department","voter_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voter" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	CONSTRAINT "voter_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"department" "department" NOT NULL,
	"name" text NOT NULL,
	"origin_name" text,
	"aliases" text[],
	"ranking" integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ranking_in_vote_work_id_idx" ON "ranking_in_vote" ("work_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vote_voter_id_idx" ON "vote" ("voter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_name_idx" ON "work" ("year","department","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_origin_name_idx" ON "work" ("year","department","origin_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_aliases_idx" ON "work" ("year","department","aliases");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ranking_in_vote" ADD CONSTRAINT "ranking_in_vote_vote_id_vote_id_fk" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ranking_in_vote" ADD CONSTRAINT "ranking_in_vote_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "work"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vote" ADD CONSTRAINT "vote_year_ceremony_year_fk" FOREIGN KEY ("year") REFERENCES "ceremony"("year") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vote" ADD CONSTRAINT "vote_voter_id_voter_id_fk" FOREIGN KEY ("voter_id") REFERENCES "voter"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work" ADD CONSTRAINT "work_year_ceremony_year_fk" FOREIGN KEY ("year") REFERENCES "ceremony"("year") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
