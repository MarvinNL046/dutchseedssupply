import { createServerSupabaseClient, getDomainId } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the current domain ID
    const domainId = await getDomainId();
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Fetch products for the current domain
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*, products(*)')
      .eq('domain_id', domainId);
    
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ 
        error: 'Error fetching products', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ products: variants });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
