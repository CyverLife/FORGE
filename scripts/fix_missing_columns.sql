-- FIX UNDEFINED COLUMN ERROR (42703)
-- Run this in Supabase SQL Editor to ensure all necessary columns exist.

-- 1. Add potentially missing columns to PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS anti_gravity_score INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consistency_score INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;

-- 2. Add potentially missing columns to HABITS
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 1;

-- 3. Verify LOGS table structure (Just in case)
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Re-create the trigger just to be safe
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        -- Verify columns exist before update to avoid error (though ALTER above handles it)
        UPDATE profiles
        SET 
            xp = COALESCE(xp, 0) + 10,
            current_streak = COALESCE(current_streak, 0) + 1,
            anti_gravity_score = COALESCE(anti_gravity_score, 0) + 5
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_habit_complete ON public.logs;
CREATE TRIGGER on_habit_complete
AFTER INSERT ON public.logs
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();
