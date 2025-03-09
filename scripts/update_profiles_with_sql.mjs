import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function updateProfilesTable() {
  try {
    console.log('Updating profiles table...');
    
    // First, let's check if the columns already exist
    const { data: profileColumns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (columnsError) {
      console.error('Error fetching profile columns:', columnsError);
    } else {
      console.log('Current profile table structure:');
      if (profileColumns && profileColumns.length > 0) {
        console.log(Object.keys(profileColumns[0]));
      } else {
        console.log('No profiles found to check structure');
      }
    }
    
    // Execute SQL to add columns
    console.log('Adding columns to profiles table...');
    
    // Use the Supabase Management API to execute SQL
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        sql_query: `
          -- Add columns to profiles table
          ALTER TABLE public.profiles 
          ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
          
          -- Update the handle_new_user function
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
        `
      })
    });
    
    if (!response.ok) {
      console.error('Error executing SQL:', await response.text());
    } else {
      console.log('SQL executed successfully');
      
      // Verify the changes
      const { data: updatedProfileColumns, error: updatedColumnsError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (updatedColumnsError) {
        console.error('Error fetching updated profile columns:', updatedColumnsError);
      } else {
        console.log('Updated profile table structure:');
        if (updatedProfileColumns && updatedProfileColumns.length > 0) {
          console.log(Object.keys(updatedProfileColumns[0]));
        } else {
          console.log('No profiles found to check structure');
        }
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateProfilesTable();
