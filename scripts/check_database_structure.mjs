import fetch from 'node-fetch';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkDatabaseStructure() {
  console.log('Checking database structure...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Role Key (first 5 chars):', supabaseKey.substring(0, 5) + '...');

  try {
    // List all tables in the database
    console.log('\n--- Listing all tables in the database ---');
    
    const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const tablesData = await tablesResponse.json();
    
    console.log('Tables in the database:', tablesData);

    // Check if profiles table exists
    console.log('\n--- Checking if profiles table exists ---');
    
    const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?limit=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Profiles table response status:', profilesResponse.status);
    
    if (profilesResponse.status === 200) {
      console.log('Profiles table exists!');
      
      // Get the structure of the profiles table
      const profilesStructureResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      const profilesStructureData = await profilesStructureResponse.json();
      
      console.log('Profiles table structure:', profilesStructureData);
    } else {
      console.log('Profiles table does not exist!');
    }

    // Check if users table exists
    console.log('\n--- Checking if users table exists ---');
    
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?limit=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Users table response status:', usersResponse.status);
    
    if (usersResponse.status === 200) {
      console.log('Users table exists!');
      
      // Get the structure of the users table
      const usersStructureResponse = await fetch(`${supabaseUrl}/rest/v1/users?limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      const usersStructureData = await usersStructureResponse.json();
      
      console.log('Users table structure:', usersStructureData);
    } else {
      console.log('Users table does not exist!');
    }

    // Check auth.users table
    console.log('\n--- Checking auth.users table ---');
    
    const authUsersResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const authUsersData = await authUsersResponse.json();
    
    console.log('Auth users response status:', authUsersResponse.status);
    console.log('Auth users data:', authUsersData);

    console.log('\nDatabase structure check completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkDatabaseStructure();
