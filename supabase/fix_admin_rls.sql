-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin All Profiles" ON profiles;
DROP POLICY IF EXISTS "Admin All Habits" ON habits;
DROP POLICY IF EXISTS "Admin All Completions" ON completions;
-- Also drop attempts with old names to be clean
DROP POLICY IF EXISTS "Admin All Completions" ON habit_completions;

-- 1. Allow Admin to VIEW ALL Profiles
CREATE POLICY "Admin All Profiles" ON profiles
FOR SELECT USING (
  auth.jwt() ->> 'email' = 'rabbuni144@gmail.com'
);

-- 2. Allow Admin to VIEW ALL Habits
CREATE POLICY "Admin All Habits" ON habits
FOR SELECT USING (
  auth.jwt() ->> 'email' = 'rabbuni144@gmail.com'
);

-- 3. Allow Admin to VIEW ALL Completions (using correct table "completions")
CREATE POLICY "Admin All Completions" ON completions
FOR SELECT USING (
  auth.jwt() ->> 'email' = 'rabbuni144@gmail.com'
);
