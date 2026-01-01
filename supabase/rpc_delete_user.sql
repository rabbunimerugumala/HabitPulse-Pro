CREATE OR REPLACE FUNCTION delete_user_and_data(p_user_id uuid)
RETURNS void AS $$
DECLARE
  current_user_email text;
BEGIN
  -- 1. Security Check: Get email of the user calling the function
  SELECT auth.jwt() ->> 'email' INTO current_user_email;
  
  -- 2. Enforce Admin Access
  IF current_user_email IS NULL OR current_user_email <> 'rabbuni144@gmail.com' THEN
    RAISE EXCEPTION 'Access Denied: You are not authorized to perform this action.';
  END IF;

  -- 3. Perform Deletes (safe now)
  -- Delete habit completions
  DELETE FROM completions WHERE habit_id IN (
    SELECT id FROM habits WHERE user_id = p_user_id
  );
  
  -- Delete habits  
  DELETE FROM habits WHERE user_id = p_user_id;
  
  -- Delete profile
  DELETE FROM profiles WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
