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

async function updateAdminRole() {
  console.log('Updating admin user role...');
  
  try {
    // Find the admin user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error listing users:', getUserError);
      return;
    }
    
    const adminUser = users.users.find(user => user.email === 'admin@dutchseedsupply.com');
    
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }
    
    console.log('Found admin user:', adminUser.id);
    
    // Check if the admin user has a profile
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id);
    
    if (profileCheckError) {
      console.error('Error checking for existing profile:', profileCheckError);
      return;
    }
    
    if (!existingProfile || existingProfile.length === 0) {
      console.log('Admin user does not have a profile. Creating one...');
      
      // Create a profile for the admin user
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: adminUser.id,
            email: adminUser.email,
            role: 'admin',
            loyalty_points: 0
          }
        ]);
      
      if (insertError) {
        console.error('Error creating admin profile:', insertError);
        return;
      }
      
      console.log('Admin profile created successfully');
    } else {
      console.log('Admin user already has a profile. Updating role...');
      
      // Update the admin user's role in the profiles table
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
      
      if (updateError) {
        console.error('Error updating admin role:', updateError);
        return;
      }
      
      console.log('Admin role updated successfully');
    }
    
    // Verify the update
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (profileError) {
      console.error('Error verifying admin profile:', profileError);
    } else {
      console.log('Admin profile:', profile);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateAdminRole();
