-- CREATE OR REPLACE FUNCTION delete_user_and_data(user_id uuid)
CREATE OR REPLACE FUNCTION delete_user_and_data(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Delete habit completions
  DELETE FROM completions WHERE habit_id IN (
    SELECT id FROM habits WHERE user_id = p_user_id
  );
  
  -- Delete habits  
  DELETE FROM habits WHERE user_id = p_user_id;
  
  -- Delete profile
  DELETE FROM profiles WHERE id = p_user_id;
  
  -- Delete auth user (optional - requires trigger)
  -- DELETE FROM auth.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
