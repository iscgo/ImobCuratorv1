-- ImobCurator Database Schema
-- Created: 31 Janeiro 2026
-- Architect: @architect (Aria)
-- Database: PostgreSQL via Supabase
-- Project ID: hdzbenshvrzndyijreio

-- ============================================
-- EXTENSIONS
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- CUSTOM TYPES / ENUMS
-- ============================================

-- None needed - using TEXT with CHECK constraints for flexibility

-- ============================================
-- TABLES
-- ============================================

-- ---------------------------------------------
-- 1. USERS (Corretores Imobiliários)
-- ---------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Auth info (synced with auth.users)
  email TEXT UNIQUE NOT NULL,

  -- Profile
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent',
  agency TEXT DEFAULT 'Independent' CHECK (agency IN (
    'Independent', 'Remax', 'KW', 'Era', 'Century21', 'Private', 'Other'
  )),
  license_number TEXT,
  phone TEXT NOT NULL,
  avatar TEXT, -- URL
  microsite_url TEXT,

  -- Plan & Usage
  plan TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO')),
  searches_used INTEGER DEFAULT 0,
  max_searches INTEGER DEFAULT 2,

  -- JSON fields
  reputation JSONB DEFAULT '{
    "level": "NEUTRAL",
    "winStreak": 0,
    "lossStreak": 0
  }'::jsonb,
  settings JSONB DEFAULT '{
    "notifications": true,
    "language": "pt-PT"
  }'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------
-- 2. CLIENTS (Clientes dos Corretores)
-- ---------------------------------------------

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar TEXT, -- URL

  -- Search criteria
  location_interest TEXT NOT NULL,
  budget TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'Searching' CHECK (status IN (
    'Searching', 'Visiting', 'Offer Made', 'Closed', 'Inactive', 'Archived'
  )),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_date TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_last_activity ON clients(last_activity DESC);

-- Trigger
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------
-- 3. PROPERTIES (Imóveis)
-- ---------------------------------------------

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',

  -- Details
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area INTEGER NOT NULL, -- m²

  -- Images
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',

  -- Links
  url TEXT, -- Original listing URL

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'NEW' CHECK (status IN (
    'NEW', 'LIKED', 'DISCARDED', 'VISIT_REQUESTED'
  )),
  agent_note TEXT,

  -- Source
  source TEXT DEFAULT 'manual' CHECK (source IN (
    'manual', 'import', 'api'
  )),
  is_simulated BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties USING gin(to_tsvector('portuguese', location));
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);

-- Trigger
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------
-- 4. VISITS (Agendamento de Visitas)
-- ---------------------------------------------

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Schedule
  date DATE NOT NULL,
  time TEXT NOT NULL, -- "14:30", "09:00", etc.

  -- Status
  status TEXT DEFAULT 'REQUESTED' CHECK (status IN (
    'REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
  )),

  -- Notes
  notes TEXT,

  -- Timeline (JSON array of status changes)
  timeline JSONB[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_client_id ON visits(client_id);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_date ON visits(date DESC);
CREATE INDEX idx_visits_status ON visits(status);

-- Trigger
CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------
-- 5. ACTIVITIES (Timeline de Atividades)
-- ---------------------------------------------

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  -- Activity info
  type TEXT NOT NULL CHECK (type IN (
    'inquiry', 'visit', 'contract', 'system'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_client_id ON activities(client_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_is_urgent ON activities(is_urgent) WHERE is_urgent = true;

-- ---------------------------------------------
-- 6. CLIENT_PROPERTIES (Many-to-Many)
-- ---------------------------------------------

CREATE TABLE client_properties (
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (client_id, property_id)
);

-- Indexes
CREATE INDEX idx_client_properties_client ON client_properties(client_id);
CREATE INDEX idx_client_properties_property ON client_properties(property_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_properties ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- RLS Policies: USERS
-- ---------------------------------------------

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ---------------------------------------------
-- RLS Policies: CLIENTS
-- ---------------------------------------------

CREATE POLICY "Users can CRUD own clients"
  ON clients
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------
-- RLS Policies: PROPERTIES
-- ---------------------------------------------

CREATE POLICY "Users can CRUD own properties"
  ON properties
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------
-- RLS Policies: VISITS
-- ---------------------------------------------

CREATE POLICY "Users can CRUD own visits"
  ON visits
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------
-- RLS Policies: ACTIVITIES
-- ---------------------------------------------

CREATE POLICY "Users can CRUD own activities"
  ON activities
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------
-- RLS Policies: CLIENT_PROPERTIES
-- ---------------------------------------------

CREATE POLICY "Users can CRUD own client_properties"
  ON client_properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_properties.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to sync user with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to increment searches_used
CREATE OR REPLACE FUNCTION public.increment_searches()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET searches_used = searches_used + 1
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data

/*
-- Sample user (Note: real users created via auth.users)
INSERT INTO users (id, email, name, phone, agency)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'joao@example.com',
  'João Silva',
  '912345678',
  'Independent'
);

-- Sample client
INSERT INTO clients (user_id, name, email, phone, location_interest, budget)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Maria Costa',
  'maria@example.com',
  '923456789',
  'Lisboa',
  '350000'
);

-- Sample property
INSERT INTO properties (user_id, title, location, price, bedrooms, bathrooms, area, image_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'T2 Espaçoso em Alvalade',
  'Lisboa, Alvalade',
  320000,
  2,
  1,
  85,
  'https://via.placeholder.com/800x600'
);
*/

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Real estate agents using ImobCurator';
COMMENT ON TABLE clients IS 'Clients of real estate agents';
COMMENT ON TABLE properties IS 'Properties (real or simulated)';
COMMENT ON TABLE visits IS 'Scheduled property visits';
COMMENT ON TABLE activities IS 'Activity timeline for agents';
COMMENT ON TABLE client_properties IS 'Many-to-many relationship between clients and properties';

COMMENT ON COLUMN users.reputation IS 'JSON: { level: ELITE|GOOD|NEUTRAL|RISK, winStreak: number, lossStreak: number }';
COMMENT ON COLUMN users.settings IS 'JSON: { notifications: boolean, language: pt-PT|pt-BR|en|fr }';
COMMENT ON COLUMN visits.timeline IS 'Array of JSON objects tracking status changes';

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Schema created successfully!
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables in Table Editor
-- 3. Test RLS policies
-- 4. Enable Auth Email provider
-- 5. Update frontend to use Supabase
