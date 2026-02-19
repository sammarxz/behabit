ALTER TABLE "habits" ADD COLUMN "reminder_time" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "xp_per_check" text DEFAULT '10' NOT NULL;