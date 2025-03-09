-- This script updates the profiles table to add new columns for user information
-- Run this in the Supabase SQL Editor

-- Add new columns to the profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';

-- Update the handle_new_user function to include the new columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    loyalty_points,
    first_name,
    last_name,
    address,
    city,
    postal_code,
    country,
    phone
  )
  VALUES (
    new.id, 
    new.email, 
    'user', 
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
