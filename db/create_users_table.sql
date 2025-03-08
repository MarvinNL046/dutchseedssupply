-- Drop existing table if it exists
DROP TABLE IF EXISTS public.users;

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS admin_all_users ON public.users;
DROP POLICY IF EXISTS users_read_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;

-- Policy for admins (can do anything with all users)
CREATE POLICY admin_all_users ON public.users
  FOR ALL
  TO authenticated
  USING (
    role = 'admin' OR 
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

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
