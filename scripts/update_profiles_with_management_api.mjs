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
    console.log('Updating profiles table...');
    
    // Add columns to profiles table
    console.log('Adding columns to profiles table...');
    
    try {
      const { error: alterError } = await supabase.rpc('alter_table', {
        table_name: 'profiles',
        column_definitions: `
          ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT ''
        `
      });
      
      if (alterError) {
        console.error('Error adding columns:', alterError);
      } else {
        console.log('Columns added successfully');
      }
    } catch (error) {
      console.error('Error adding columns:', error);
    }
    
    // Manually add each column as a fallback
    const columnsToAdd = [
      'first_name',
      'last_name',
      'address',
      'city',
      'postal_code',
      'country',
      'phone'
    ];
    
    for (const column of columnsToAdd) {
      try {
        console.log(`Adding column ${column}...`);
        const { error } = await supabase.rpc('add_column', {
          table_name: 'profiles',
          column_name: column,
          column_type: 'TEXT',
          column_default: "''"
        });
        
        if (error) {
          console.error(`Error adding column ${column}:`, error);
        } else {
          console.log(`Column ${column} added successfully`);
        }
      } catch (error) {
        console.error(`Error adding column ${column}:`, error);
      }
    }
    
    // Update the handle_new_user function
    console.log('Updating handle_new_user function...');
    
    try {
      const { error: functionError } = await supabase.rpc('create_function', {
        function_name: 'handle_new_user',
        function_definition: `
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
      });
      
      if (functionError) {
        console.error('Error updating function:', functionError);
      } else {
        console.log('Function updated successfully');
      }
    } catch (error) {
      console.error('Error updating function:', error);
    }
    
    // Recreate the trigger
    console.log('Recreating trigger...');
    
    try {
      const { error: dropTriggerError } = await supabase.rpc('drop_trigger', {
        trigger_name: 'on_auth_user_created',
        table_name: 'auth.users'
      });
      
      if (dropTriggerError) {
        console.error('Error dropping trigger:', dropTriggerError);
      } else {
        console.log('Trigger dropped successfully');
      }
    } catch (error) {
      console.error('Error dropping trigger:', error);
    }
    
    try {
      const { error: createTriggerError } = await supabase.rpc('create_trigger', {
        trigger_name: 'on_auth_user_created',
        table_name: 'auth.users',
        trigger_timing: 'AFTER',
        trigger_operation: 'INSERT',
        trigger_function: 'public.handle_new_user()'
      });
      
      if (createTriggerError) {
        console.error('Error creating trigger:', createTriggerError);
      } else {
        console.log('Trigger created successfully');
      }
    } catch (error) {
      console.error('Error creating trigger:', error);
    }
    
    // Verify the changes
    console.log('Verifying changes...');
    const { data: profileColumns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (columnsError) {
      console.error('Error fetching profile columns:', columnsError);
    } else {
      console.log('Profile table structure:');
      if (profileColumns && profileColumns.length > 0) {
        console.log(Object.keys(profileColumns[0]));
      } else {
        console.log('No profiles found to check structure');
      }
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateProfilesTable();
