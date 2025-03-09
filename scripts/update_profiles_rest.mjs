import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

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
    
    // Update the profiles table directly
    console.log('Updating profiles table...');
    
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
    
    // Check if we have any profiles
    if (profileColumns && profileColumns.length > 0) {
      const profileId = profileColumns[0].id;
      
      // Add each column by updating a profile with the new field
      for (const column of columnsToAdd) {
        console.log(`Adding column ${column}...`);
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ [column]: '' })
            .eq('id', profileId);
          
          if (error) {
            if (error.message.includes('column') && error.message.includes('does not exist')) {
              console.log(`Column ${column} doesn't exist yet. Creating it...`);
              
              // Try to create the column using the Supabase Management API
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/add_column`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
                    },
                    body: JSON.stringify({
                      table_name: 'profiles',
                      column_name: column,
                      column_type: 'text',
                      column_default: "''"
                    })
                  }
                );
                
                if (!response.ok) {
                  console.error(`Error creating column ${column}:`, await response.text());
                } else {
                  console.log(`Column ${column} created successfully`);
                }
              } catch (createError) {
                console.error(`Error creating column ${column}:`, createError);
              }
            } else {
              console.error(`Error adding column ${column}:`, error);
            }
          } else {
            console.log(`Column ${column} already exists or was added successfully`);
          }
        } catch (error) {
          console.error(`Error processing column ${column}:`, error);
        }
      }
    } else {
      console.log('No profiles found to update. Creating a test profile...');
      
      // Create a test profile
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'test@example.com',
          role: 'user',
          loyalty_points: 0,
          first_name: '',
          last_name: '',
          address: '',
          city: '',
          postal_code: '',
          country: '',
          phone: ''
        });
      
      if (createError) {
        console.error('Error creating test profile:', createError);
      } else {
        console.log('Test profile created successfully');
      }
    }
    
    // Update the handle_new_user function
    console.log('Updating handle_new_user function...');
    
    // Use the Supabase Management API to update the function
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/create_function`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          },
          body: JSON.stringify({
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
          })
        }
      );
      
      if (!response.ok) {
        console.error('Error updating function:', await response.text());
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
updateProfilesTable();
