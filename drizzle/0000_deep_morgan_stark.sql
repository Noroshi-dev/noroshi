CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`thread_id` integer NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`user_id` integer NOT NULL,
	`replies_count` integer DEFAULT 0,
	`views_count` integer DEFAULT 0,
	`votes_count` integer DEFAULT 0,
	`likes_count` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`threads_count` integer DEFAULT 0,
	`messages_count` integer DEFAULT 0,
	`members_count` integer DEFAULT 0,
	`participation_condition` integer DEFAULT 0,
	`description` text DEFAULT '',
	`icon_url` text DEFAULT '',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`title` text NOT NULL,
	`messages_count` integer DEFAULT 0,
	`members_count` integer DEFAULT 0,
	`view_permission` integer DEFAULT 0,
	`write_permission` integer DEFAULT 1,
	`description` text DEFAULT '',
	`icon_url` text DEFAULT '',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text DEFAULT '',
	`icon_url` text DEFAULT '',
	`password_hash` text DEFAULT '',
	`profile` text DEFAULT '',
	`projects_count` integer DEFAULT 0,
	`threads_count` integer DEFAULT 0,
	`messages_count` integer DEFAULT 0,
	`votes_count` integer DEFAULT 0,
	`likes_count` integer DEFAULT 0,
	`followers_count` integer DEFAULT 0,
	`follows_count` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
