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
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateProfilesTable() {
  try {
    console.log('Updating profiles table directly...');
    
    // Add columns to profiles table using REST API
    console.log('Adding columns to profiles table...');
    
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
    
    // Use the Supabase SQL API to execute raw SQL
    console.log('Executing SQL to add columns...');
    
    // We'll use the REST API to execute SQL statements
    const alterTableResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: `
            ALTER TABLE public.profiles 
            ADD COLUMN IF NOT EXISTS first_name TEXT,
            ADD COLUMN IF NOT EXISTS last_name TEXT,
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS city TEXT,
            ADD COLUMN IF NOT EXISTS postal_code TEXT,
            ADD COLUMN IF NOT EXISTS country TEXT,
            ADD COLUMN IF NOT EXISTS phone TEXT;
          `
        })
      }
    );
    
    if (!alterTableResponse.ok) {
      console.error('Error adding columns:', await alterTableResponse.text());
    } else {
      console.log('Columns added successfully');
    }
    
    // Update the handle_new_user function
    console.log('Updating handle_new_user function...');
    const updateFunctionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: `
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
          `
        })
      }
    );
    
    if (!updateFunctionResponse.ok) {
      console.error('Error updating function:', await updateFunctionResponse.text());
    } else {
      console.log('Function updated successfully');
    }
    
    // Recreate the trigger
    console.log('Recreating trigger...');
    const dropTriggerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`
        })
      }
    );
    
    if (!dropTriggerResponse.ok) {
      console.error('Error dropping trigger:', await dropTriggerResponse.text());
    } else {
      console.log('Trigger dropped successfully');
      
      const createTriggerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            query: `
              CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            `
          })
        }
      );
      
      if (!createTriggerResponse.ok) {
        console.error('Error creating trigger:', await createTriggerResponse.text());
      } else {
        console.log('Trigger created successfully');
      }
    }
    
    // Verify the changes
    console.log('Verifying changes...');
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
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateProfilesTable();
