# User Registration Documentation

This document provides information about the user registration process in the Dutch Seed Supply application.

## Overview

The application allows users to register for an account, which enables them to:
- Place orders
- Track order history
- Earn loyalty points
- Access personalized features

## Registration Flow

The registration process follows these steps:

1. User fills out the registration form at `/register`
2. The form data is submitted to the server via the `signup` server action
3. Supabase creates a new user in the `auth.users` table
4. The server action manually inserts the user into the `public.users` table with the 'user' role
5. A confirmation email is sent to the user's email address
6. User clicks the confirmation link in the email
7. The user is redirected to the welcome page at `/welcome`
8. The user can now log in with their credentials

> **Note**: We initially implemented a database trigger to automatically add users to the `public.users` table, but due to some issues, we now manually insert the user in the server action. The trigger SQL is still available in `db/user_registration_trigger.sql` if you want to try that approach.

## Implementation Details

### Database Tables

The application uses two tables for user management:

1. `auth.users` - Managed by Supabase Auth, contains authentication information
2. `public.users` - Custom table that contains application-specific user data

### Manual User Insertion

The server action manually inserts the user into the `public.users` table after creating the user in the `auth.users` table:

```typescript
// Manually insert the user into the public.users table
if (data.user) {
  const { error: insertError } = await supabase
    .from('users')
    .insert([
      { 
        id: data.user.id, 
        email: data.user.email, 
        role: 'user',
        loyalty_points: 0
      }
    ])

  if (insertError) {
    console.error('Error inserting user into public.users table:', insertError)
    // Continue anyway, as the user was created in auth.users
  }
}
```

### Server Actions

The application uses Next.js server actions for user registration:

```typescript
// app/login/actions.ts
export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
        data: {
          full_name: formData.get('name') as string || '',
        }
      },
    })

    if (error) {
      console.error('Signup error:', error)
      return redirect('/register?error=' + encodeURIComponent(error.message))
    }

    // Manually insert the user into the public.users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user.id, 
            email: data.user.email, 
            role: 'user',
            loyalty_points: 0
          }
        ])

      if (insertError) {
        console.error('Error inserting user into public.users table:', insertError)
        // Continue anyway, as the user was created in auth.users
      }
    }

    return redirect('/register?message=Controleer je e-mail om je account te bevestigen.')
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return redirect('/register?error=Er is een onverwachte fout opgetreden bij het registreren.')
  }
}
```

### Email Confirmation

The application uses Supabase's built-in email confirmation system. When a user clicks the confirmation link, they are redirected to the `/auth/confirm` route, which verifies the token and redirects the user to the welcome page:

```typescript
// app/auth/confirm/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/welcome'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to welcome page
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}
```

## Row Level Security (RLS) Policies

The application uses Supabase Row Level Security (RLS) policies to control access to user data:

```sql
-- Policy for admins (can do anything with all users)
CREATE POLICY admin_all_users ON public.users
  FOR ALL
  TO authenticated
  USING (
    -- Only check the current row, not query the table again
    (auth.uid() = id AND role = 'admin') OR
    -- Or a specific admin email (as fallback)
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marvinsmit1988@gmail.com'
  );

-- Policy for service role (can do anything)
CREATE POLICY service_role_all_users ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for users (can read their own data)
CREATE POLICY users_read_own ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy for users (can update their own data except role)
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = 'user');

-- Policy for inserting users (server can insert new users)
CREATE POLICY insert_users ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```

## Setup Instructions

To set up the user registration system:

1. Create the `public.users` table using the SQL in `db/create_users_table.sql`
2. Update the RLS policies using the SQL in `db/update_rls_policies.sql`
3. Configure Supabase Auth settings in the Supabase dashboard:
   - Enable email confirmations
   - Set the site URL to your application URL
   - Configure email templates if desired

You can also use the provided script to update the RLS policies:

```bash
node scripts/update_rls_policies.mjs
```

## Troubleshooting

If you encounter issues with user registration:

1. Check that the Supabase Auth settings are correctly configured
2. Verify that the RLS policies are set up correctly
3. Check the server logs for any errors during the signup process
4. Verify that the email confirmation process is working correctly

Common issues:

- **Database error saving new user**: This could be due to RLS policies preventing the insert. Try updating the RLS policies using the script provided.
- **Email confirmation not working**: Check the Supabase Auth settings and the redirect URL
- **Users unable to access their data**: Check the RLS policies
