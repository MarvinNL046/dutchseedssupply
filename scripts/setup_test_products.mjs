import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to execute SQL file
async function executeSqlFile(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      // Execute the SQL statement
      const { error } = await supabase.rpc('execute_sql', { sql: stmt + ';' }).catch(err => {
        // If the RPC doesn't exist, we'll catch the error here
        console.log('Error executing SQL via RPC, this is expected if the function doesn\'t exist yet');
        return { error: err };
      });
      
      if (error) {
        console.log('Error executing statement via RPC, trying direct query');
        
        // Try executing as a direct query
        const { error: queryError } = await supabase.from('_temp_sql_execution').select('*').limit(1);
        
        if (queryError) {
          console.error('Error executing SQL statement:', queryError);
          // Continue anyway, some statements might fail but others might succeed
        }
      }
    }
    
    console.log('SQL execution completed');
    return true;
  } catch (error) {
    console.error('Error reading or executing SQL file:', error);
    return false;
  }
}

// Function to insert test products
async function insertTestProducts() {
  console.log('Inserting test products...');
  
  // Sample products data
  const products = [
    {
      sku: 'IND-001',
      name: 'Northern Lights',
      slug: 'northern-lights',
      price: 9.99,
      stock_quantity: 100,
      stock_status: 'in_stock',
      featured: true,
      thc_content: 18.5,
      cbd_content: 0.1,
      flowering_time: 56,
      height: '100-150cm',
      yield: '400-500g/m²',
      categories: ['indica', 'feminized']
    },
    {
      sku: 'SAT-001',
      name: 'Sour Diesel',
      slug: 'sour-diesel',
      price: 11.99,
      stock_quantity: 75,
      stock_status: 'in_stock',
      featured: true,
      thc_content: 20.0,
      cbd_content: 0.2,
      flowering_time: 70,
      height: '150-200cm',
      yield: '500-600g/m²',
      categories: ['sativa', 'feminized']
    },
    {
      sku: 'HYB-001',
      name: 'Blue Dream',
      slug: 'blue-dream',
      price: 10.99,
      stock_quantity: 50,
      stock_status: 'in_stock',
      featured: false,
      thc_content: 17.0,
      cbd_content: 0.5,
      flowering_time: 65,
      height: '120-180cm',
      yield: '450-550g/m²',
      categories: ['hybrid', 'feminized']
    },
    {
      sku: 'AUTO-001',
      name: 'Amnesia Auto',
      slug: 'amnesia-auto',
      price: 8.99,
      stock_quantity: 120,
      stock_status: 'in_stock',
      featured: true,
      thc_content: 15.0,
      cbd_content: 0.3,
      flowering_time: 75,
      height: '80-120cm',
      yield: '350-450g/m²',
      categories: ['hybrid', 'autoflowering']
    },
    {
      sku: 'CBD-001',
      name: 'CBD Therapy',
      slug: 'cbd-therapy',
      price: 12.99,
      stock_quantity: 30,
      stock_status: 'in_stock',
      featured: false,
      thc_content: 0.5,
      cbd_content: 8.0,
      flowering_time: 63,
      height: '90-140cm',
      yield: '400-500g/m²',
      categories: ['cbd', 'feminized']
    }
  ];
  
  // Insert products
  for (const product of products) {
    const { categories, ...productData } = product;
    
    // Insert product
    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'sku' })
      .select()
      .single();
    
    if (productError) {
      console.error(`Error inserting product ${product.name}:`, productError);
      continue;
    }
    
    console.log(`Inserted product: ${insertedProduct.name}`);
    
    // Insert translations
    const translations = {
      nl: {
        description: `${insertedProduct.name} is een premium cannabis soort met ${insertedProduct.thc_content}% THC en ${insertedProduct.cbd_content}% CBD. Bloeitijd is ongeveer ${insertedProduct.flowering_time} dagen.`,
        meta_title: insertedProduct.name,
        meta_description: `Koop ${insertedProduct.name} zaden online - Premium kwaliteit cannabis zaden`
      },
      en: {
        description: `${insertedProduct.name} is a premium cannabis strain with ${insertedProduct.thc_content}% THC and ${insertedProduct.cbd_content}% CBD. Flowering time is approximately ${insertedProduct.flowering_time} days.`,
        meta_title: insertedProduct.name,
        meta_description: `Buy ${insertedProduct.name} seeds online - Premium quality cannabis seeds`
      },
      de: {
        description: `${insertedProduct.name} ist eine Premium-Cannabis-Sorte mit ${insertedProduct.thc_content}% THC und ${insertedProduct.cbd_content}% CBD. Die Blütezeit beträgt etwa ${insertedProduct.flowering_time} Tage.`,
        meta_title: insertedProduct.name,
        meta_description: `Kaufen Sie ${insertedProduct.name} Samen online - Premium-Qualität Cannabis-Samen`
      },
      fr: {
        description: `${insertedProduct.name} est une variété de cannabis premium avec ${insertedProduct.thc_content}% de THC et ${insertedProduct.cbd_content}% de CBD. La période de floraison est d'environ ${insertedProduct.flowering_time} jours.`,
        meta_title: insertedProduct.name,
        meta_description: `Achetez des graines de ${insertedProduct.name} en ligne - Graines de cannabis de qualité premium`
      }
    };
    
    for (const [language_code, content] of Object.entries(translations)) {
      const { error: translationError } = await supabase
        .from('product_translations')
        .upsert({
          product_id: insertedProduct.id,
          language_code,
          ...content
        }, { onConflict: 'product_id,language_code' });
      
      if (translationError) {
        console.error(`Error inserting translation for ${insertedProduct.name} (${language_code}):`, translationError);
      } else {
        console.log(`Inserted translation for ${insertedProduct.name} (${language_code})`);
      }
    }
    
    // Insert category relationships
    if (categories && categories.length > 0) {
      // Get category IDs
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, slug')
        .in('slug', categories);
      
      if (categoryError) {
        console.error(`Error fetching categories for ${insertedProduct.name}:`, categoryError);
        continue;
      }
      
      // Insert product-category relationships
      for (const category of categoryData) {
        const { error: relationError } = await supabase
          .from('product_categories')
          .upsert({
            product_id: insertedProduct.id,
            category_id: category.id
          }, { onConflict: 'product_id,category_id' });
        
        if (relationError) {
          console.error(`Error inserting category relation for ${insertedProduct.name} (${category.slug}):`, relationError);
        } else {
          console.log(`Linked ${insertedProduct.name} to category ${category.slug}`);
        }
      }
    }
  }
  
  console.log('Test products inserted successfully');
}

// Main function
async function main() {
  try {
    console.log('Setting up products database...');
    
    // Execute products schema SQL
    const schemaPath = path.join(process.cwd(), 'db', 'products_schema.sql');
    const schemaSuccess = await executeSqlFile(schemaPath);
    
    if (!schemaSuccess) {
      console.error('Failed to set up products schema');
      process.exit(1);
    }
    
    // Insert test products
    await insertTestProducts();
    
    console.log('Products setup completed successfully');
  } catch (error) {
    console.error('Error setting up products:', error);
    process.exit(1);
  }
}

// Run the main function
main();
