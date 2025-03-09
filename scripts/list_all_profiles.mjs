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

async function listAllProfiles() {
  console.log('Listing all profiles...');
  
  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error getting profiles:', profilesError);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('No profiles found');
      return;
    }
    
    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach(profile => {
      console.log(`- ${profile.email} (${profile.role}): ${profile.id}`);
    });
    
    // Count users by role
    const roles = {};
    profiles.forEach(profile => {
      roles[profile.role] = (roles[profile.role] || 0) + 1;
    });
    
    console.log('\nUsers by role:');
    Object.entries(roles).forEach(([role, count]) => {
      console.log(`- ${role}: ${count}`);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
listAllProfiles();
