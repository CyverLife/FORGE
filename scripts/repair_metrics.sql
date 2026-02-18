-- REPAIR METRICS AND STREAKS
-- This script synchronizes XP calculation and fixes daily streak logic.

-- 1. Ensure helper column for streak tracking exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_habit_at TIMESTAMP WITH TIME ZONE;

-- 2. Update XP Function with correct Leveling Curve (Square Root)
-- Formula: Level = Floor(sqrt(TotalXP / 100)) + 1
CREATE OR REPLACE FUNCTION add_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    new_xp INTEGER;
    new_level INTEGER;
BEGIN
    -- Get current XP and add new amount
    SELECT xp + xp_amount INTO new_xp FROM profiles WHERE id = user_id;
    
    -- Calculate new level based on curve
    new_level := FLOOR(SQRT(new_xp / 100)) + 1;
    
    UPDATE profiles
    SET xp = new_xp,
        level = new_level,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update Profile Stats Trigger for Intelligence Daily Streaks
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    today_date DATE;
BEGIN
    IF NEW.status = 'completed' THEN
        today_date := CURRENT_DATE;
        
        -- Get the date of the last completed habit
        SELECT (last_habit_at AT TIME ZONE 'UTC')::DATE INTO last_date 
        FROM profiles 
        WHERE id = NEW.user_id;

        IF last_date IS NULL THEN
            -- First habit ever
            UPDATE profiles SET 
                current_streak = 1,
                last_habit_at = NOW(),
                anti_gravity_score = COALESCE(anti_gravity_score, 0) + 5
            WHERE id = NEW.user_id;
        ELSIF last_date = today_date THEN
            -- Already completed a habit today, don't increment streak
            UPDATE profiles SET 
                last_habit_at = NOW(),
                anti_gravity_score = COALESCE(anti_gravity_score, 0) + 2 -- Bonus for multiple habits
            WHERE id = NEW.user_id;
        ELSIF last_date = today_date - INTERVAL '1 day' THEN
            -- Consecutive day!
            UPDATE profiles SET 
                current_streak = current_streak + 1,
                last_habit_at = NOW(),
                anti_gravity_score = COALESCE(anti_gravity_score, 0) + 10,
                longest_streak = GREATEST(longest_streak, current_streak + 1)
            WHERE id = NEW.user_id;
        ELSE
            -- Streak broken
            UPDATE profiles SET 
                current_streak = 1,
                last_habit_at = NOW(),
                anti_gravity_score = COALESCE(anti_gravity_score, 0) + 5
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger
DROP TRIGGER IF EXISTS on_habit_complete ON public.logs;
CREATE TRIGGER on_habit_complete
AFTER INSERT ON public.logs
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();
