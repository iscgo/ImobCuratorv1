-- ImobCurator - User Authentication Tables
-- Apply this SQL in Supabase SQL Editor: https://app.supabase.com

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
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
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_login" TIMESTAMP(3),

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'users';
