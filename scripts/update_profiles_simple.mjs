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
    console.log('Checking current profile table structure...');
    
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
    
    // Add columns directly using the Supabase API
    console.log('Adding columns to profiles table...');
    
    // Define the columns to add
    const columnsToAdd = [
      'first_name',
      'last_name',
      'address',
      'city',
      'postal_code',
      'country',
      'phone'
    ];
    
    // Add each column
    for (const column of columnsToAdd) {
      console.log(`Adding column ${column}...`);
      
      try {
        // Add the column if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .update({ [column]: '' })
          .eq('id', profileColumns[0].id);
        
        if (error) {
          console.error(`Error adding column ${column}:`, error);
        } else {
          console.log(`Column ${column} added or updated successfully`);
        }
      } catch (error) {
        console.error(`Error processing column ${column}:`, error);
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
    
    console.log('Done!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateProfilesTable();
