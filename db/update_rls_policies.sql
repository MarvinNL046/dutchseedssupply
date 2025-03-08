-- This script updates the RLS policies for the users table
-- Run this in the Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS admin_all_users ON public.users;
DROP POLICY IF EXISTS users_read_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS insert_users ON public.users;

-- Policy for admins (can do anything with all users)
CREATE POLICY admin_all_users ON public.users
  FOR ALL
  TO authenticated
  USING (
    -- Only check the current row, not query the table again
    (auth.uid() = id AND role = 'admin') OR
    -- Or a specific admin email (as fallback)
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marvinsmit1988@gmail.com'
  );

-- Policy for service role (can do anything)
CREATE POLICY service_role_all_users ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for users (can read their own data)
CREATE POLICY users_read_own ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy for users (can update their own data except role)
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = 'user');

-- Policy for inserting users (server can insert new users)
CREATE POLICY insert_users ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'users';
