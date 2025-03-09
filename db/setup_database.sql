-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS admin_all_profiles ON public.profiles;
DROP POLICY IF EXISTS users_read_own_profile ON public.profiles;
DROP POLICY IF EXISTS users_update_own_profile ON public.profiles;
DROP POLICY IF EXISTS service_role_all_profiles ON public.profiles;

-- Policy for admins (can do anything with all profiles)
CREATE POLICY admin_all_profiles ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy for users (can read their own data)
CREATE POLICY users_read_own_profile ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy for users (can update their own data except role)
CREATE POLICY users_update_own_profile ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = 'user');

-- Policy for service role (can do anything)
CREATE POLICY service_role_all_profiles ON public.profiles
  FOR ALL
  TO service_role
  USING (true);

-- Create the handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, loyalty_points)
  VALUES (new.id, new.email, 'user', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
