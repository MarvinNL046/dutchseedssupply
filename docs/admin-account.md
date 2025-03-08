# Admin Account Documentation

This document provides information about the admin account setup, authentication flow, and Row Level Security (RLS) policies in the Dutch Seed Supply application.

## Admin Account

The admin account is set up with the following details:

- **Email**: marvinsmit1988@gmail.com
- **Role**: admin
- **ID**: 0edc4efd-93e5-440b-a4d6-3a74863a09c5

This account has special privileges in the application, including access to the admin dashboard and the ability to manage products, orders, and users.

## Authentication Flow

The authentication flow for admin users works as follows:

1. User logs in via the login page (`/login`)
2. The server action in `app/login/actions.ts` authenticates the user with Supabase
3. If authentication is successful, the server action checks if the user is an admin:
   - It queries the `public.users` table to check if the user's role is 'admin'
   - It also has a fallback for the known admin email (marvinsmit1988@gmail.com)
4. If the user is an admin, they are redirected to the admin dashboard (`/admin`)
5. The admin layout (`app/admin/layout.tsx`) performs an additional check to ensure only admin users can access admin pages:
   - It uses a special admin client with the service role key to bypass RLS
   - This ensures that even with strict RLS policies, admin pages can still access the necessary data

## Row Level Security (RLS) Policies

The application uses Supabase Row Level Security (RLS) policies to control access to data. The following policies are defined for the `public.users` table:

### Current Policies

```sql
-- Policy for admins (can do anything with all users)
CREATE POLICY admin_all_users ON public.users
  FOR ALL
  TO authenticated
  USING (
    role = 'admin' OR 
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

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
```

### Known Issues

The `admin_all_users` policy can cause an infinite recursion error because it tries to query the `public.users` table again to check if the user is an admin. This creates a circular dependency.

### Fixed Policy

If you encounter the "infinite recursion detected in policy for relation 'users'" error, use the following SQL to fix it:

```sql
-- Drop the existing policy
DROP POLICY IF EXISTS admin_all_users ON public.users;

-- Create a new policy without recursion
CREATE POLICY admin_all_users ON public.users
  FOR ALL
  TO authenticated
  USING (
    -- Only check the current row, not query the table again
    (auth.uid() = id AND role = 'admin') OR
    -- Or a specific admin email (as fallback)
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marvinsmit1988@gmail.com'
  );
```

This new policy avoids recursion by:
1. Checking if the current user (auth.uid()) matches the row being accessed (id) AND if the role is 'admin'
2. OR checking if the email of the current user matches the known admin email

## Admin Client

To ensure that admin pages can access the necessary data even with strict RLS policies, we use a special admin client with the service role key:

```typescript
// lib/supabase.js
export async function createServerSupabaseAdminClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        async get(name) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        // ... other cookie methods
      },
    }
  );
}
```

This client is used in the admin layout to check the user's role:

```typescript
// app/admin/layout.tsx
const adminSupabase = await createServerSupabaseAdminClient();
      
// Check admin role with admin client
const { data: user, error: userError } = await adminSupabase
  .from('users')
  .select('role')
  .eq('id', session.user.id)
  .single();
```

## Troubleshooting

If you encounter issues with admin access, check the following:

1. **User exists in auth.users**: Run the `scripts/check_admin_user.mjs` script to verify that the admin user exists in both `auth.users` and `public.users` tables.

2. **RLS policies**: If you see "infinite recursion" errors, update the RLS policy as described above.

3. **Login redirect**: If you're not being redirected to the admin page after login, check the `app/login/actions.ts` file to ensure it's checking for admin users and redirecting correctly.

4. **Admin layout**: If you can access `/admin` but see errors, check the `app/admin/layout.tsx` file to ensure it's correctly using the admin client to check for admin users.

5. **Permission denied errors**: If you see "permission denied for table users" errors, make sure the admin layout is using the admin client with the service role key.

## Security Recommendations

1. Use `supabase.auth.getUser()` instead of `supabase.auth.getSession()` for more secure authentication.

2. Consider implementing Multi-Factor Authentication (MFA) for admin accounts.

3. Regularly review and update RLS policies to ensure they provide the appropriate level of security.
