-- ImobCurator - User Authentication Tables (Simplified)
-- Apply this SQL in Supabase SQL Editor

-- Create users table
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password_hash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "agency" TEXT,
  "license_number" TEXT,
  "avatar_url" TEXT,
  "language" TEXT NOT NULL DEFAULT 'pt-PT',
  "timezone" TEXT NOT NULL DEFAULT 'Europe/Lisbon',
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "theme" TEXT NOT NULL DEFAULT 'light',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "last_login" TIMESTAMPTZ
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify
SELECT * FROM "users" LIMIT 1;
