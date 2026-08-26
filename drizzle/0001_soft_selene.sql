PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`role` text DEFAULT 'EDITOR',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_admin_users`("id", "email", "name", "password_hash", "salt", "role", "created_at") SELECT "id", "email", "name", "password_hash", "salt", "role", "created_at" FROM `admin_users`;--> statement-breakpoint
DROP TABLE `admin_users`;--> statement-breakpoint
ALTER TABLE `__new_admin_users` RENAME TO `admin_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_board_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`category` text NOT NULL,
	`image_url` text NOT NULL,
	`bio` text,
	`order_index` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`tenure_year` text DEFAULT '2026',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_board_members`("id", "name", "role", "category", "image_url", "bio", "order_index", "is_active", "tenure_year", "created_at", "updated_at") SELECT "id", "name", "role", "category", "image_url", "bio", "order_index", "is_active", "tenure_year", "created_at", "updated_at" FROM `board_members`;--> statement-breakpoint
DROP TABLE `board_members`;--> statement-breakpoint
ALTER TABLE `__new_board_members` RENAME TO `board_members`;--> statement-breakpoint
CREATE TABLE `__new_contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'UNREAD',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_contact_messages`("id", "name", "email", "subject", "message", "status", "created_at") SELECT "id", "name", "email", "subject", "message", "status", "created_at" FROM `contact_messages`;--> statement-breakpoint
DROP TABLE `contact_messages`;--> statement-breakpoint
ALTER TABLE `__new_contact_messages` RENAME TO `contact_messages`;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'UPCOMING',
	`date` text NOT NULL,
	`time` text NOT NULL,
	`location` text NOT NULL,
	`mode` text,
	`description` text NOT NULL,
	`tags` text NOT NULL,
	`highlights` text,
	`image_url` text,
	`registration_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "title", "type", "status", "date", "time", "location", "mode", "description", "tags", "highlights", "image_url", "registration_url", "created_at") SELECT "id", "title", "type", "status", "date", "time", "location", "mode", "description", "tags", "highlights", "image_url", "registration_url", "created_at" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
CREATE TABLE `__new_gallery_items` (
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
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_gallery_items`("id", "title", "quote", "date", "year", "category", "tags", "image_url", "width", "height", "aspect_class", "created_at") SELECT "id", "title", "quote", "date", "year", "category", "tags", "image_url", "width", "height", "aspect_class", "created_at" FROM `gallery_items`;--> statement-breakpoint
DROP TABLE `gallery_items`;--> statement-breakpoint
ALTER TABLE `__new_gallery_items` RENAME TO `gallery_items`;