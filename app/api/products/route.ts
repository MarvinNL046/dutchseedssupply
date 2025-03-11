import { createServerSupabaseClient, getLocale, getDomainId } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const featured = url.searchParams.get('featured') === 'true';
    const search = url.searchParams.get('search') || '';
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get the current locale and domain ID
    const locale = await getLocale();
    const domainId = await getDomainId();
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Start building the query
    let query = supabase
      .from('products')
      .select(`
        *,
        product_translations(*),
        product_variants(*),
        product_categories(
          category_id,
          categories(*)
        )
      `)
      .eq('product_translations.language_code', locale);
    
    // Check if product_variants table exists and filter by domain
    try {
      // Try to select from product_variants to see if it exists
      const { error: variantsError } = await supabase
        .from('product_variants')
        .select('id')
        .limit(1);
      
      if (!variantsError) {
        // If no error, the table exists, so we can filter by domain
        query = query.eq('product_variants.domain_id', domainId);
      }
    } catch (err) {
      console.log('product_variants table might not exist yet, skipping domain filtering:', err);
    }
    
    // Apply filters
    if (category) {
      // First get the category ID for the given slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (categoryError) {
        console.error('Error fetching category:', categoryError);
      } else if (categoryData) {
        // Then filter products by that category ID
        query = query.eq('product_categories.category_id', categoryData.id);
      }
    }
    
    if (featured) {
      query = query.eq('featured', true);
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting products:', countError);
      return NextResponse.json({ 
        error: 'Error counting products', 
        details: countError.message 
      }, { status: 500 });
    }
    
    // Execute the query with pagination
    const { data: products, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      // Check if the error is because the tables don't exist yet
      if (error.code === '42P01') {
        console.log('Products tables do not exist yet. This is normal if no products have been created.');
        return NextResponse.json({ 
          products: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0
          }
        });
      }
      
      console.error('Error fetching products:', error);
      return NextResponse.json({ 
        error: 'Error fetching products', 
        details: error.message 
      }, { status: 500 });
    }
    
    // Define types for the product data structure
    interface ProductCategory {
      category_id: string;
      categories: {
        id: string;
        name: string;
        slug: string;
        created_at: string;
      };
    }
    
    interface ProductTranslation {
      id: string;
      product_id: string;
      language_code: string;
      description?: string;
      meta_title?: string;
      meta_description?: string;
      created_at: string;
      updated_at: string;
    }
    
    interface ProductVariant {
      id: string;
      product_id: string;
      domain_id: string;
      price: number;
      sale_price?: number;
      stock_quantity: number;
      stock_status: string;
      available: boolean;
      created_at: string;
      updated_at: string;
    }
    
    // Process the products to format them correctly
    const formattedProducts = products?.map(product => {
      const translation = product.product_translations?.[0] as ProductTranslation || {};
      const categories = product.product_categories?.map((pc: ProductCategory) => pc.categories) || [];
      const variant = product.product_variants?.[0] as ProductVariant;
      
      return {
        ...product,
        description: translation.description || '',
        meta_title: translation.meta_title || '',
        meta_description: translation.meta_description || '',
        categories,
        // Use variant price and stock if available
        price: variant?.price || product.price,
        sale_price: variant?.sale_price || product.sale_price,
        stock_quantity: variant?.stock_quantity || product.stock_quantity,
        stock_status: variant?.stock_status || product.stock_status,
        available: variant?.available !== undefined ? variant.available : true,
        // Remove the nested objects to clean up the response
        product_translations: undefined,
        product_categories: undefined,
        product_variants: undefined
      };
    }) || [];
    
    // Calculate total pages
    const totalPages = Math.ceil((totalCount || 0) / limit);
    
    return NextResponse.json({ 
      products: formattedProducts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Admin route to create a new product
export async function POST(request: Request) {
  try {
    // Create Supabase admin client to bypass RLS
    const supabase = await createServerSupabaseClient();
    
    // Get the request body
    const body = await request.json();
    
    // Validate the request
    if (!body.name || !body.price) {
      return NextResponse.json({ 
        error: 'Name and price are required' 
      }, { status: 400 });
    }
    
    // Extract product data, translations, and variants
    const { 
      translations = {}, 
      categories: categoryIds = [],
      variants = [],
      ...productData 
    } = body;
    
    // Generate a slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Start a transaction
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (productError) {
      console.error('Error creating product:', productError);
      return NextResponse.json({ 
        error: 'Error creating product', 
        details: productError.message 
      }, { status: 500 });
    }
    
    // Define interface for translation content
    interface TranslationContent {
      description?: string;
      meta_title?: string;
      meta_description?: string;
    }
    
    // Insert translations if provided
    if (translations && Object.keys(translations).length > 0) {
      const translationRows = Object.entries(translations).map(entry => {
        const [language_code, content] = entry as [string, TranslationContent];
        return {
          product_id: product.id,
          language_code,
          ...content
        };
      });
      
      const { error: translationError } = await supabase
        .from('product_translations')
        .insert(translationRows);
      
      if (translationError) {
        console.error('Error creating product translations:', translationError);
        // Continue anyway, we'll return the product without translations
      }
    }
    
    // Insert category relationships if provided
    if (categoryIds && categoryIds.length > 0) {
      const categoryRows = categoryIds.map((category_id: string) => ({
        product_id: product.id,
        category_id
      }));
      
      const { error: categoryError } = await supabase
        .from('product_categories')
        .insert(categoryRows);
      
      if (categoryError) {
        console.error('Error creating product categories:', categoryError);
        // Continue anyway, we'll return the product without categories
      }
    }
    
    // Insert variants if provided
    if (variants && variants.length > 0) {
      // Define interface for variant
      interface ProductVariant {
        domain_id: string;
        price: number;
        sale_price?: number;
        stock_quantity: number;
        stock_status?: string;
        available: boolean;
      }
      
      const variantRows = variants.map((variant: ProductVariant) => ({
        product_id: product.id,
        ...variant
      }));
      
      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantRows);
      
      if (variantError) {
        console.error('Error creating product variants:', variantError);
        // Continue anyway, we'll return the product without variants
      }
    }
    
    return NextResponse.json({ 
      product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in create product API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
