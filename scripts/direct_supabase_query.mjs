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

async function directSupabaseQuery() {
  console.log('Performing direct Supabase query...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Role Key (first 5 chars):', supabaseKey.substring(0, 5) + '...');

  try {
    // Test direct connection to Supabase REST API
    console.log('\n--- Testing direct connection to Supabase REST API ---');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    // Test direct connection to Supabase Auth API
    console.log('\n--- Testing direct connection to Supabase Auth API ---');
    
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const authData = await authResponse.json();
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', authData);

    // Try to create a user directly
    console.log('\n--- Testing user creation via Auth API ---');
    
    const email = `test-direct-${Date.now()}@example.com`;
    const password = 'Password123!';
    
    console.log(`Creating user with email: ${email}`);
    
    const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true
      })
    });
    
    const createUserData = await createUserResponse.json();
    
    console.log('Create user response status:', createUserResponse.status);
    console.log('Create user response data:', createUserData);

    // If user creation was successful, check if the user was added to the profiles table
    if (createUserResponse.status === 201 && createUserData.id) {
      console.log('\n--- Checking if user was added to profiles table ---');
      
      const userId = createUserData.id;
      
      const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      const profileData = await profileResponse.json();
      
      console.log('Profile response status:', profileResponse.status);
      console.log('Profile response data:', profileData);
      
      if (profileData.length === 0) {
        console.log('\nUser was not automatically added to profiles table. Trying to add manually...');
        
        const insertProfileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            id: userId,
            email,
            role: 'user',
            loyalty_points: 0
          })
        });
        
        const insertProfileData = await insertProfileResponse.json();
        
        console.log('Insert profile response status:', insertProfileResponse.status);
        console.log('Insert profile response data:', insertProfileData);
      }
    }

    console.log('\nDirect Supabase query completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
directSupabaseQuery();
