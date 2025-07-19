-- Add new columns to user table
ALTER TABLE user ADD COLUMN email text;
ALTER TABLE user ADD COLUMN email_verified integer DEFAULT 0 NOT NULL;
ALTER TABLE user ADD COLUMN created_at integer DEFAULT (strftime('%s', 'now')) NOT NULL;
ALTER TABLE user ADD COLUMN updated_at integer DEFAULT (strftime('%s', 'now')) NOT NULL;

-- Create email verification tokens table
CREATE TABLE email_verification_token (
	id text PRIMARY KEY NOT NULL,
	user_id text NOT NULL,
	email text NOT NULL,
	expires_at integer NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create password reset tokens table
CREATE TABLE password_reset_token (
	id text PRIMARY KEY NOT NULL,
	user_id text NOT NULL,
	expires_at integer NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id)
);
