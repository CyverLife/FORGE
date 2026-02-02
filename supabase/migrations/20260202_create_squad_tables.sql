-- Squad System Tables
-- Creates tables for social accountability features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Squads table: Main squad information
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  collective_hp INTEGER DEFAULT 100 CHECK (collective_hp >= 0 AND collective_hp <= 150),
  invite_code TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad members table: Tracks user membership
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_hp INTEGER DEFAULT 100 CHECK (personal_hp >= 0 AND personal_hp <= 120),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- Squad activity feed: Tracks events
CREATE TABLE IF NOT EXISTS squad_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('completed', 'failed', 'joined', 'left', 'hp_bonus', 'hp_damage')),
  habit_title TEXT,
  hp_change INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_squad_members_user_id ON squad_members(user_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad_id ON squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_activity_squad_id ON squad_activity(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_activity_created_at ON squad_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_squads_invite_code ON squads(invite_code);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_activity ENABLE ROW LEVEL SECURITY;

-- Squads policies
-- Users can view squads they are members of
CREATE POLICY "Users can view their squads"
  ON squads FOR SELECT
  USING (
    id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
  );

-- Users can create squads (automatically becomes owner)
CREATE POLICY "Users can create squads"
  ON squads FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Only owners can update squad settings
CREATE POLICY "Owners can update their squads"
  ON squads FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Owners can delete squads
CREATE POLICY "Owners can delete their squads"
  ON squads FOR DELETE
  USING (owner_id = auth.uid());

-- Squad members policies
-- Users can view members of their squads
CREATE POLICY "Users can view squad members"
  ON squad_members FOR SELECT
  USING (
    squad_id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
  );

-- Users can join squads
CREATE POLICY "Users can join squads"
  ON squad_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave squads
CREATE POLICY "Users can leave squads"
  ON squad_members FOR DELETE
  USING (user_id = auth.uid());

-- Squad activity policies
-- Users can view activity from their squads
CREATE POLICY "Users can view squad activity"
  ON squad_activity FOR SELECT
  USING (
    squad_id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
  );

-- Users can create activity entries
CREATE POLICY "Users can create squad activity"
  ON squad_activity FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite codes
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM squads WHERE invite_code = NEW.invite_code) LOOP
      NEW.invite_code := generate_invite_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invite_code
  BEFORE INSERT ON squads
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_squads_updated_at
  BEFORE UPDATE ON squads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
