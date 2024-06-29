CREATE TABLE `projects_members` (
	`project_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`project_id`, `user_id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);