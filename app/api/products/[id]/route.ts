import { createServerSupabaseClient, getLocale } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
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
    
    // Get the current locale
    const locale = await getLocale();
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Fetch product details with translations and categories
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        product_translations(*),
        product_categories(
          category_id,
          categories(*)
        )
      `)
      .eq('id', productId)
      .single();
    
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
      return NextResponse.json({ 
        error: 'Error fetching product', 
        details: productError.message 
      }, { status: 500 });
    }
    
    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
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
    
    // Find the translation for the current locale
    const translation = product.product_translations?.find(
      (t: ProductTranslation) => t.language_code === locale
    ) || product.product_translations?.[0] || {};
    
    // Extract categories
    const categories = product.product_categories?.map(
      (pc: ProductCategory) => pc.categories
    ) || [];
    
    // Format the product with translations
    const formattedProduct = {
      ...product,
      description: translation.description || '',
      meta_title: translation.meta_title || '',
      meta_description: translation.meta_description || '',
      categories,
      // Include all translations for admin purposes
      translations: product.product_translations,
      // Remove the nested objects to clean up the response
      product_translations: undefined,
      product_categories: undefined
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
      } catch (error) {
        console.error('Error fetching related products:', error);
        // Continue anyway, related products are not critical
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
    
    // Extract product data and translations
    const { 
      translations = {}, 
      categories: categoryIds = [], 
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
