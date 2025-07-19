-- Enhancement for authentication system
-- Add email verification and password reset functionality

-- Add new columns to user table
ALTER TABLE `user` ADD COLUMN `email` text;
ALTER TABLE `user` ADD COLUMN `email_verified` integer DEFAULT false NOT NULL;
ALTER TABLE `user` ADD COLUMN `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;
ALTER TABLE `user` ADD COLUMN `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;

-- Create unique index for email
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);

-- Create email verification tokens table
CREATE TABLE `email_verification_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create password reset tokens table
CREATE TABLE `password_reset_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);

-- Remove age column (SQLite doesn't support DROP COLUMN directly, so we need to recreate the table)
PRAGMA foreign_keys=OFF;

CREATE TABLE `user_new` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Copy data from old table (set default email for existing users)
INSERT INTO `user_new` (`id`, `email`, `username`, `password_hash`, `email_verified`, `created_at`, `updated_at`)
SELECT `id`, COALESCE(`email`, `username` || '@example.com'), `username`, `password_hash`, 
       COALESCE(`email_verified`, 0), 
       COALESCE(`created_at`, strftime('%s', 'now')), 
       COALESCE(`updated_at`, strftime('%s', 'now'))
FROM `user`;

-- Drop old table and rename new one
DROP TABLE `user`;
ALTER TABLE `user_new` RENAME TO `user`;

-- Recreate indexes
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);

PRAGMA foreign_keys=ON;
