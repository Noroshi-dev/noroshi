DROP TABLE `verificationToken`;--> statement-breakpoint
ALTER TABLE `account` RENAME TO `accounts`;--> statement-breakpoint
ALTER TABLE `session` RENAME TO `sessions`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `access_token` TO `token`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `expires_at`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `token_type`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `scope`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `id_token`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `session_state`;