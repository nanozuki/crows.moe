ALTER TABLE "work_name" DROP CONSTRAINT "work_name_name_unique";--> statement-breakpoint
ALTER TABLE "work_name" ADD COLUMN "department" "department" NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_name_name_idx" ON "work_name" ("name","department");