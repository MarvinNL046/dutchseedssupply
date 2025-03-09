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

async function addProfileColumns() {
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
    
    // Add columns one by one using the Supabase API
    console.log('Adding columns to profiles table...');
    
    // Define the columns to add
    const columnsToAdd = [
      { name: 'first_name', type: 'text', default: '' },
      { name: 'last_name', type: 'text', default: '' },
      { name: 'address', type: 'text', default: '' },
      { name: 'city', type: 'text', default: '' },
      { name: 'postal_code', type: 'text', default: '' },
      { name: 'country', type: 'text', default: '' },
      { name: 'phone', type: 'text', default: '' }
    ];
    
    // Add each column
    for (const column of columnsToAdd) {
      console.log(`Adding column ${column.name}...`);
      
      try {
        // Check if the column already exists
        const { data: existingColumns, error: existingColumnsError } = await supabase
          .rpc('get_column_info', {
            table_name: 'profiles',
            schema_name: 'public'
          });
        
        if (existingColumnsError) {
          console.error(`Error checking if column ${column.name} exists:`, existingColumnsError);
          continue;
        }
        
        const columnExists = existingColumns && existingColumns.some(col => col.column_name === column.name);
        
        if (columnExists) {
          console.log(`Column ${column.name} already exists, skipping...`);
          continue;
        }
        
        // Add the column
        const { error: addColumnError } = await supabase
          .rpc('add_column', {
            table_name: 'profiles',
            column_name: column.name,
            column_type: column.type,
            column_default: column.default
          });
        
        if (addColumnError) {
          console.error(`Error adding column ${column.name}:`, addColumnError);
        } else {
          console.log(`Column ${column.name} added successfully`);
        }
      } catch (error) {
        console.error(`Error processing column ${column.name}:`, error);
      }
    }
    
    // Update the handle_new_user function
    console.log('Updating handle_new_user function...');
    
    try {
      const { error: updateFunctionError } = await supabase
        .rpc('update_function', {
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
      
      if (updateFunctionError) {
        console.error('Error updating function:', updateFunctionError);
      } else {
        console.log('Function updated successfully');
      }
    } catch (error) {
      console.error('Error updating function:', error);
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
addProfileColumns();
