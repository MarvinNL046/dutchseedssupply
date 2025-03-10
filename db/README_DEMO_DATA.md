# Cannabis Seeds Demo Data

This directory contains SQL scripts and utilities to populate your database with realistic cannabis seed product data for the Dutch Seed Supply website.

## Demo Data Contents

The demo data includes:

- **10 Popular Cannabis Strains** with realistic properties:
  - Northern Lights (Indica)
  - OG Kush (Hybrid)
  - Amnesia Haze (Sativa)
  - White Widow (Hybrid)
  - Girl Scout Cookies (Hybrid)
  - Blue Dream (Hybrid)
  - AK-47 (Hybrid)
  - Gorilla Glue (Hybrid)
  - Sour Diesel (Sativa)
  - CBD Critical Mass (CBD)

- **Complete Product Details**:
  - THC/CBD percentages
  - Flowering time
  - Height
  - Yield
  - Images (placeholder URLs)

- **Translations** for all products in:
  - English
  - Dutch
  - German
  - French

- **Price Variants** for different domains:
  - .nl
  - .com
  - .de
  - .fr

- **Category Associations** for:
  - Indica
  - Sativa
  - Hybrid
  - Autoflowering
  - Feminized
  - CBD

## How to Add Demo Data

### Option 1: Using the Windows Batch Script (Easiest)

For Windows users, we've included a convenient batch script:

1. First, update the `.env` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Double-click on `insert_demo_data.bat` in the root directory or run it from the command line:
   ```
   .\insert_demo_data.bat
   ```

3. Follow the on-screen instructions.

### Option 2: Using the Node.js Script

1. Make sure your environment variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the script:
   ```bash
   node scripts/insert_demo_data.mjs
   ```

   This script will:
   - Read the SQL from `db/insert_demo_products.sql`
   - Execute it against your Supabase database
   - Handle any errors and provide feedback

### Option 3: Alternative Direct Method

If the first method doesn't work (e.g., if the `exec_sql` RPC function is not available), use:

```bash
node scripts/insert_demo_data_direct.mjs
```

This script uses a different approach to execute the SQL directly.

### Option 4: Manual SQL Execution

You can also execute the SQL directly in the Supabase SQL Editor:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `db/insert_demo_products.sql`
4. Paste into the SQL Editor and run

## Notes

- The script is designed to be idempotent - you can run it multiple times without creating duplicates
- Products are identified by their slug, so running the script again will update existing products
- If you want to start fresh, uncomment the DELETE statements at the top of the SQL file

## Troubleshooting

If you encounter errors:

1. **Database Connection Issues**:
   - Verify your Supabase URL and service role key are correct
   - Ensure your IP is allowed in Supabase's network restrictions

2. **Permission Errors**:
   - Make sure you're using the service role key, not the anon key
   - Check that RLS policies aren't blocking the operations

3. **SQL Execution Errors**:
   - Look for specific error messages in the console output
   - Check if the tables exist in your database
   - Verify that your database schema matches what the script expects
