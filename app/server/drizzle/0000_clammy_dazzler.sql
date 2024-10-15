DO $$ BEGIN
 CREATE TYPE "public"."convert_job_status" AS ENUM('pending', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."convert_job_type" AS ENUM('mp3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "convert_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"videoId" text NOT NULL,
	"file_id" text NOT NULL,
	"title" text NOT NULL,
	"type" "convert_job_type" NOT NULL,
	"status" "convert_job_status" DEFAULT 'pending' NOT NULL,
	"download_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "file_id_idx" ON "convert_jobs" ("file_id");