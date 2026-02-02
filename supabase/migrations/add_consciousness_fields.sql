-- Migration: Add Consciousness System Fields
-- Description: Adds consciousness rank, level, and dual metrics (Angel vs Simio) to profiles table

-- Add consciousness fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS consciousness_rank TEXT DEFAULT 'BRONCE' CHECK (consciousness_rank IN ('BRONCE', 'PLATA', 'ORO', 'INFINITO')),
ADD COLUMN IF NOT EXISTS consciousness_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS angel_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS simio_score INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN profiles.consciousness_rank IS 'Consciousness rank: BRONCE (1-25), PLATA (26-50), ORO (51-75), INFINITO (76+)';
COMMENT ON COLUMN profiles.consciousness_level IS 'Current consciousness level, determines rank';
COMMENT ON COLUMN profiles.angel_score IS 'Angel decisions count - discipline, focus, purpose';
COMMENT ON COLUMN profiles.simio_score IS 'Simio decisions count - impulsivity, procrastination';

-- Create function to auto-update consciousness rank based on level
CREATE OR REPLACE FUNCTION update_consciousness_rank()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.level >= 76 THEN
    NEW.consciousness_rank := 'INFINITO';
  ELSIF NEW.level >= 51 THEN
    NEW.consciousness_rank := 'ORO';
  ELSIF NEW.level >= 26 THEN
    NEW.consciousness_rank := 'PLATA';
  ELSE
    NEW.consciousness_rank := 'BRONCE';
  END IF;
  
  NEW.consciousness_level := NEW.level;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update consciousness rank
DROP TRIGGER IF EXISTS trigger_update_consciousness_rank ON profiles;
CREATE TRIGGER trigger_update_consciousness_rank
  BEFORE UPDATE OF level ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_consciousness_rank();

-- Update existing profiles to set initial consciousness rank
UPDATE profiles
SET 
  consciousness_level = level,
  consciousness_rank = CASE
    WHEN level >= 76 THEN 'INFINITO'
    WHEN level >= 51 THEN 'ORO'
    WHEN level >= 26 THEN 'PLATA'
    ELSE 'BRONCE'
  END
WHERE consciousness_rank IS NULL OR consciousness_level IS NULL;
