import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import ProductForm from '../components/ProductForm';

export default async function AdminProductDetailPage({
  params
}: {
  params: { id: string }
}) {
  // Check admin rights
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Check if user is admin
  const { data: user } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  
  // Check if this is a new product
  const isNewProduct = params.id === 'new';
  let product = null;
  let translations = [];
  let variants = [];
  
  if (!isNewProduct) {
    // Fetch product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (productError || !productData) {
      // Product not found
      redirect('/admin/products');
    }
    
    product = productData;
    
    // Fetch translations
    const { data: translationsData } = await supabase
      .from('product_translations')
      .select('*')
      .eq('product_id', params.id);
    
    if (translationsData) {
      translations = translationsData;
    }
    
    // Fetch variants
    const { data: variantsData } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', params.id);
    
    if (variantsData) {
      variants = variantsData;
    }
  }
  
  // Fetch available domains and languages for dropdowns
  const availableDomains = ['nl', 'com', 'de', 'fr'];
  const availableLanguages = ['nl', 'en', 'de', 'fr'];
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isNewProduct ? 'Nieuw product' : `Product bewerken: ${product?.name}`}
        </h1>
        <Link 
          href="/admin/products" 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Terug naar overzicht
        </Link>
      </div>
      
      <ProductForm 
        product={product}
        translations={translations}
        variants={variants}
        availableDomains={availableDomains}
        availableLanguages={availableLanguages}
        isNewProduct={isNewProduct}
      />
    </div>
  );
}
