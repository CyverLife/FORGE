-- Migration: Portal Decision System
-- Description: Creates portal_decisions table and updates trigger for angel/simio scores

-- Create portal_decisions table
CREATE TABLE IF NOT EXISTS portal_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  habit_id UUID REFERENCES habits ON DELETE CASCADE,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('BRIGHTEN', 'DARKEN')),
  context TEXT, -- Optional note from user
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for portal_decisions
ALTER TABLE portal_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portal decisions" 
  ON portal_decisions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portal decisions" 
  ON portal_decisions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle portal decisions
CREATE OR REPLACE FUNCTION handle_portal_decision()
RETURNS TRIGGER AS $$
BEGIN
  -- Update angel or simio score based on decision type
  UPDATE profiles
  SET 
    angel_score = CASE 
      WHEN NEW.decision_type = 'BRIGHTEN' THEN angel_score + 1
      ELSE angel_score
    END,
    simio_score = CASE 
      WHEN NEW.decision_type = 'DARKEN' THEN simio_score + 1
      ELSE simio_score
    END,
    anti_gravity_score = CASE
      WHEN NEW.decision_type = 'BRIGHTEN' THEN LEAST(100, anti_gravity_score + 10)
      WHEN NEW.decision_type = 'DARKEN' THEN GREATEST(0, anti_gravity_score - 5)
      ELSE anti_gravity_score
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for portal decisions
DROP TRIGGER IF EXISTS trigger_handle_portal_decision ON portal_decisions;
CREATE TRIGGER trigger_handle_portal_decision
  AFTER INSERT ON portal_decisions
  FOR EACH ROW
  EXECUTE FUNCTION handle_portal_decision();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_portal_decisions_user_id ON portal_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_decisions_created_at ON portal_decisions(created_at DESC);
