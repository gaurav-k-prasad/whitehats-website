CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`role` text DEFAULT 'EDITOR',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `board_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`category` text NOT NULL,
	`image_url` text NOT NULL,
	`bio` text,
	`order_index` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`tenure_year` text DEFAULT '2026',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `club_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`order_index` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `club_stats_key_unique` ON `club_stats` (`key`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'UNREAD',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'UPCOMING',
	`date` text NOT NULL,
	`time` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`tags` text NOT NULL,
	`image_url` text,
	`registration_url` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`quote` text DEFAULT '',
	`date` text DEFAULT '',
	`year` text DEFAULT '2026',
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`image_url` text NOT NULL,
	`width` integer DEFAULT 600,
	`height` integer DEFAULT 400,
	`aspect_class` text DEFAULT 'aspect-[3/2]',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`visibility` text DEFAULT 'Public',
	`status` text NOT NULL,
	`description` text NOT NULL,
	`icon_type` text DEFAULT 'terminal',
	`tech_stack` text NOT NULL,
	`contributors` integer DEFAULT 1,
	`github_url` text NOT NULL,
	`live_demo_url` text,
	`order_index` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);