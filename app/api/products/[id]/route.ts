import { createServerSupabaseClient, getDomainId } from '@/lib/supabase';
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
    
    // Get the current domain ID
    const domainId = await getDomainId();
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error('Error fetching product:', productError);
      return NextResponse.json({ 
        error: 'Error fetching product', 
        details: productError.message 
      }, { status: 500 });
    }
    
    // Fetch product variant for the current domain
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('domain_id', domainId)
      .single();
    
    if (variantError && variantError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error fetching product variant:', variantError);
      return NextResponse.json({ 
        error: 'Error fetching product variant', 
        details: variantError.message 
      }, { status: 500 });
    }
    
    // Fetch related products
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('id, name')
      .eq('category', product.category)
      .neq('id', productId)
      .limit(4);
    
    if (relatedError) {
      console.error('Error fetching related products:', relatedError);
      // Continue anyway, related products are not critical
    }
    
    return NextResponse.json({ 
      product,
      variant: variant || null,
      relatedProducts: relatedProducts || []
    });
  } catch (error) {
    console.error('Error in product detail API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
