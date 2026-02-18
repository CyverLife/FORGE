-- Create a unique index to prevent duplicate logs for the same habit on the same day
CREATE UNIQUE INDEX IF NOT EXISTS logs_habit_day_unique_idx 
ON public.logs (habit_id, (completed_at::date));

-- Optional: Add a comment to explain the constraint
COMMENT ON INDEX logs_habit_day_unique_idx IS 'Ensures a habit can only be logged once per day.';
