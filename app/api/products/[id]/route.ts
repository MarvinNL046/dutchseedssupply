import { createServerSupabaseClient, getLocale, getDomainId } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    console.log(`API: Fetching product with ID: ${productId}`);
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }
    
    // Get the current locale and domain ID
    const locale = await getLocale();
    const domainId = await getDomainId();
    
    console.log(`API: Using locale=${locale}, domainId=${domainId}`);
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    console.log(`API: Supabase client created successfully`);
    
    console.log(`API: Executing Supabase query for product ID: ${productId}`);
    
    // Declare product variable in the outer scope
    let product;
    let productError;
    
    try {
      // Fetch product details with translations, categories, and variants
      const result = await supabase
        .from('products')
        .select(`
          *,
          product_translations(*),
          product_categories(
            category_id,
            categories(*)
          ),
          product_variants(*)
        `)
        .eq('id', productId)
        .single();
      
      product = result.data;
      productError = result.error;
      
      console.log(`API: Query executed. Product found: ${!!product}, Error: ${!!productError}`);
      
      if (productError) {
        // Check if the error is because the tables don't exist yet
        if (productError.code === '42P01') {
          console.log('Products tables do not exist yet. This is normal if no products have been created.');
          return NextResponse.json({ 
            error: 'Product not found',
            details: 'The products database has not been set up yet.'
          }, { status: 404 });
        }
        
        console.error('Error fetching product:', productError);
        console.error('Error code:', productError.code);
        console.error('Error message:', productError.message);
        console.error('Error details:', productError.details);
        return NextResponse.json({ 
          error: 'Error fetching product', 
          details: productError.message 
        }, { status: 500 });
      }
      
      if (!product) {
        console.log(`API: No product found with ID: ${productId}`);
        return NextResponse.json({ 
          error: 'Product not found' 
        }, { status: 404 });
      }
      
      console.log(`API: Product found: ${product.name}`);
    } catch (dbError) {
      console.error('Unexpected error during database query:', dbError);
      return NextResponse.json({ 
        error: 'Database error', 
        details: dbError instanceof Error ? dbError.message : 'Unknown database error' 
      }, { status: 500 });
    }
    
    // Define interfaces for the product data structure
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
    
    interface Category {
      id: string;
      name: string;
      slug: string;
      created_at: string;
    }
    
    interface ProductCategory {
      category_id: string;
      categories: Category;
    }
    
    // Define interface for product variant
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
    
    // Find the translation for the current locale
    const translation = product.product_translations?.find(
      (t: ProductTranslation) => t.language_code === locale
    ) || product.product_translations?.[0] || {};
    
    // Extract categories
    const categories = product.product_categories?.map(
      (pc: ProductCategory) => pc.categories
    ) || [];
    
    // Find the variant for the current domain
    let variant = product.product_variants?.find(
      (v: ProductVariant) => v.domain_id === domainId
    );
    
    console.log(`Looking for variant with domainId=${domainId}`);
    console.log(`Available variants:`, JSON.stringify(product.product_variants, null, 2));
    
    // If no variant found for the current domain, use any available variant as fallback
    if (!variant && product.product_variants && product.product_variants.length > 0) {
      console.log(`No variant found for domain ${domainId}, using fallback`);
      variant = product.product_variants[0];
    }
    
    // Format the product with translations and variant
    const formattedProduct = {
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
      // Include variant for the current domain
      variant: variant || null,
      // Include all translations for admin purposes
      translations: product.product_translations,
      // Remove the nested objects to clean up the response
      product_translations: undefined,
      product_categories: undefined,
      product_variants: undefined
    };
    
    // Fetch related products (products in the same categories)
    const categoryIds = categories.map((c: Category) => c.id);
    
    // Define the type for related products
    interface RelatedProduct {
      id: string;
      name: string;
      slug: string;
      price: number;
      sale_price?: number;
      images: string[];
      stock_status: string;
    }
    
    let relatedProducts: RelatedProduct[] = [];
    
    if (categoryIds.length > 0) {
      try {
        // First, get product IDs in the same categories
        const { data: relatedIds, error: relatedIdsError } = await supabase
          .from('product_categories')
          .select('product_id')
          .in('category_id', categoryIds)
          .neq('product_id', productId);
        
        if (!relatedIdsError && relatedIds && relatedIds.length > 0) {
          // Extract unique product IDs
          const uniqueProductIds = [...new Set(relatedIds.map(item => item.product_id))];
          
          // Then fetch the actual products
          const { data: related, error: relatedError } = await supabase
            .from('products')
            .select('id, name, slug, price, sale_price, images, stock_status')
            .in('id', uniqueProductIds)
            .limit(4);
          
          if (!relatedError && related) {
            relatedProducts = related as RelatedProduct[];
          }
        }
        
        // If no related products found by category, get random products
        if (!relatedProducts || relatedProducts.length === 0) {
          console.log('No related products found by category, fetching random products');
          const { data: randomProducts, error: randomError } = await supabase
            .from('products')
            .select('id, name, slug, price, sale_price, images, stock_status')
            .neq('id', productId)
            .limit(4);
          
          if (!randomError && randomProducts && randomProducts.length > 0) {
            relatedProducts = randomProducts as RelatedProduct[];
          }
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        // Continue anyway, related products are not critical
      }
    } else {
      // If product has no categories, get random products
      console.log('Product has no categories, fetching random products');
      try {
        const { data: randomProducts, error: randomError } = await supabase
          .from('products')
          .select('id, name, slug, price, sale_price, images, stock_status')
          .neq('id', productId)
          .limit(4);
        
        if (!randomError && randomProducts && randomProducts.length > 0) {
          relatedProducts = randomProducts as RelatedProduct[];
        }
      } catch (error) {
        console.error('Error fetching random products:', error);
      }
    }
    
    return NextResponse.json({ 
      product: formattedProduct,
      relatedProducts
    });
  } catch (error) {
    console.error('Error in product detail API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Admin route to update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Get the request body
    const body = await request.json();
    
    // Extract product data, translations, and variants
    const { 
      translations = {}, 
      categories: categoryIds = [],
      variants = [],
      ...productData 
    } = body;
    
    // Update the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
    
    if (productError) {
      console.error('Error updating product:', productError);
      return NextResponse.json({ 
        error: 'Error updating product', 
        details: productError.message 
      }, { status: 500 });
    }
    
    // Update translations if provided
    if (translations && Object.keys(translations).length > 0) {
      // First, get existing translations
      const { data: existingTranslations } = await supabase
        .from('product_translations')
        .select('id, language_code')
        .eq('product_id', productId);
      
      interface TranslationRecord {
        id: string;
        language_code: string;
      }
      
      const existingLanguages = new Map(
        existingTranslations?.map((t: TranslationRecord) => [t.language_code, t.id]) || []
      );
      
      // Process each translation
      for (const [language_code, content] of Object.entries(translations)) {
        if (existingLanguages.has(language_code)) {
          // Update existing translation
          await supabase
            .from('product_translations')
            .update(content)
            .eq('id', existingLanguages.get(language_code));
        } else {
          // Define interface for translation content
          interface TranslationContent {
            description?: string;
            meta_title?: string;
            meta_description?: string;
          }
          
          // Insert new translation
          await supabase
            .from('product_translations')
            .insert({
              product_id: productId,
              language_code,
              ...(content as TranslationContent)
            });
        }
      }
    }
    
    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      // First, delete existing category relationships
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', productId);
      
      // Then insert new ones
      const categoryRows = categoryIds.map((category_id: string) => ({
        product_id: productId,
        category_id
      }));
      
      await supabase
        .from('product_categories')
        .insert(categoryRows);
    }
    
    // Update variants if provided
    if (variants && variants.length > 0) {
      // Define interface for variant
      interface ProductVariant {
        id?: string;
        domain_id: string;
        price: number;
        sale_price?: number;
        stock_quantity: number;
        stock_status?: string;
        available: boolean;
      }
      
      // First, get existing variants
      const { data: existingVariants } = await supabase
        .from('product_variants')
        .select('id, domain_id')
        .eq('product_id', productId);
      
      const existingDomains = new Map(
        existingVariants?.map((v: { id: string; domain_id: string }) => [v.domain_id, v.id]) || []
      );
      
      // Process each variant
      for (const variant of variants) {
        const { domain_id, ...variantData } = variant as ProductVariant;
        
        if (existingDomains.has(domain_id)) {
          // Update existing variant
          await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', existingDomains.get(domain_id));
        } else {
          // Insert new variant
          await supabase
            .from('product_variants')
            .insert({
              product_id: productId,
              domain_id,
              ...variantData
            });
        }
      }
    }
    
    return NextResponse.json({ 
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error in update product API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Admin route to delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Delete the product (translations and categories will be deleted via cascade)
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json({ 
        error: 'Error deleting product', 
        details: deleteError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error in delete product API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
