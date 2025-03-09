import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to create tables
async function createTables() {
  console.log('Creating tables...');
  
  // Create categories table
  const { error: categoriesError } = await supabase.rpc('create_categories_table').catch(() => {
    return { error: { message: 'RPC not available, trying direct query' } };
  });
  
  if (categoriesError) {
    console.log('Creating categories table via direct query...');
    const { error } = await supabase.from('categories').select('*').limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Categories table does not exist, creating...');
      // We'll create it when we insert categories
    }
  }
  
  // Create products table
  const { error: productsError } = await supabase.rpc('create_products_table').catch(() => {
    return { error: { message: 'RPC not available, trying direct query' } };
  });
  
  if (productsError) {
    console.log('Creating products table via direct query...');
    const { error } = await supabase.from('products').select('*').limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Products table does not exist, creating...');
      // We'll create it when we insert products
    }
  }
  
  console.log('Tables created or already exist');
  return true;
}

// Function to insert categories
async function insertCategories() {
  console.log('Inserting categories...');
  
  const categories = [
    { name: 'Indica', slug: 'indica' },
    { name: 'Sativa', slug: 'sativa' },
    { name: 'Hybrid', slug: 'hybrid' },
    { name: 'Autoflowering', slug: 'autoflowering' },
    { name: 'Feminized', slug: 'feminized' },
    { name: 'CBD', slug: 'cbd' }
  ];
  
  const { error } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting categories:', error);
    return false;
  }
  
  console.log('Categories inserted successfully');
  return true;
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
    
    // Create tables
    await createTables();
    
    // Insert categories
    await insertCategories();
    
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
