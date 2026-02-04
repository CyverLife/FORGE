-- Function to update profile stats on habit completion
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
DECLARE
    xp_gain INT := 10;
    score_gain INT := 5;
    habit_essence TEXT;
BEGIN
    -- Get habit details (Essence)
    SELECT essence_type INTO habit_essence
    FROM habits
    WHERE id = NEW.habit_id;

    IF NEW.status = 'completed' THEN
        UPDATE profiles
        SET
            xp = COALESCE(xp, 0) + xp_gain,
            anti_gravity_score = COALESCE(anti_gravity_score, 0) + score_gain,
            level = FLOOR(SQRT((COALESCE(xp, 0) + xp_gain) / 100)) + 1,
            current_streak = COALESCE(current_streak, 0) + 1,
            -- Update Essence Scores based on Habit Type
            angel_score = CASE WHEN habit_essence = 'ANGEL' THEN COALESCE(angel_score, 0) + 1 ELSE angel_score END,
            simio_score = CASE WHEN habit_essence = 'SIMIO' THEN COALESCE(simio_score, 0) + 1 ELSE simio_score END,
            updated_at = NOW()
        WHERE id = NEW.user_id;

    -- Optional: Handle 'failed' status if needed (e.g. break streak)
    ELSIF NEW.status = 'failed' THEN
         UPDATE profiles
        SET
            current_streak = 0,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trigger_update_profile_stats ON logs;

CREATE TRIGGER trigger_update_profile_stats
AFTER INSERT ON logs
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();
