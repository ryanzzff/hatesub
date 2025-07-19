CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`created_at` integer DEFAULT '"2025-07-19T15:56:15.928Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`cost` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`billing_cycle` text NOT NULL,
	`renewal_date` integer,
	`category` text NOT NULL,
	`subscription_reason` text NOT NULL,
	`usage_rating` integer,
	`value_rating` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT '"2025-07-19T15:56:15.928Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-19T15:56:15.928Z"' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`default_currency` text DEFAULT 'USD' NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`notification_email` integer DEFAULT true NOT NULL,
	`notification_push` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-07-19T15:56:15.928Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-19T15:56:15.928Z"' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-07-19T15:56:15.927Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-19T15:56:15.927Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "email", "username", "password_hash", "email_verified", "created_at", "updated_at") SELECT "id", "email", "username", "password_hash", "email_verified", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);