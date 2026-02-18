-- Function to add XP to a user
CREATE OR REPLACE FUNCTION add_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET xp = xp + xp_amount,
        level = FLOOR((xp + xp_amount) / 100) + 1,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_xp(UUID, INTEGER) TO authenticated;
