-- Migration: Sensory Slides System
-- Description: Adds sensory_slide (JSONB), essence_type, and portal_mantra to habits table

-- Add columns to habits table
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS sensory_slide JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essence_type TEXT CHECK (essence_type IN ('ANGEL', 'SIMIO', 'NEUTRAL')) DEFAULT 'NEUTRAL',
ADD COLUMN IF NOT EXISTS portal_mantra TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN habits.sensory_slide IS 'JSON containing title, narrative, visual_mood, sensory_details, and portal_actions';
COMMENT ON COLUMN habits.essence_type IS 'Origin of the habit: ANGEL (purpose), SIMIO (pleasure/validation), or NEUTRAL';
COMMENT ON COLUMN habits.portal_mantra IS 'Short phrase to repeat when entering the portal';

-- Example JSON structure for sensory_slide (Update existing habits if needed)
/*
{
  "title": "El Reflejo del Esfuerzo",
  "narrative": "Estoy frente al espejo...",
  "visual_mood": "url_to_image",
  "sensory_details": {
    "sight": "Luz natural...",
    "sound": "Música suave...",
    "smell": "Aroma a...",
    "touch": "Tela suave...",
    "emotion": "Paz"
  },
  "consciousness_message": "Entrenas para honrar tu cuerpo",
  "portal_actions": {
    "brighten": "Ir al gym",
    "darken": "Procrastinar"
  }
}
*/
