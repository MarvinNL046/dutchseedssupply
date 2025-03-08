-- This script adds the loyalty_points column to the users table
-- Run this in the Supabase SQL Editor for the production database

-- Check if the column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'loyalty_points'
    ) THEN
        -- Add the loyalty_points column if it doesn't exist
        ALTER TABLE public.users ADD COLUMN loyalty_points INTEGER DEFAULT 0;
        
        -- Log the change
        RAISE NOTICE 'Added loyalty_points column to users table';
    ELSE
        RAISE NOTICE 'loyalty_points column already exists in users table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'loyalty_points';
