ALTER TABLE `users` ADD `display_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `type`;