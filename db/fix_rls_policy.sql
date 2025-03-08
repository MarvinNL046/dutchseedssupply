-- This script fixes the infinite recursion issue in the admin_all_users policy
-- Run this in the Supabase SQL Editor if you encounter the error:
-- "infinite recursion detected in policy for relation 'users'"

-- Drop the existing policies
DROP POLICY IF EXISTS admin_all_users ON public.users;
DROP POLICY IF EXISTS service_role_all_users ON public.users;

-- Create a new policy without recursion
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

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname = 'admin_all_users';
