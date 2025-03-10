import { getTranslations } from '@/lib/i18n';
import { getDomainId } from '@/lib/supabase';
import translations from '@/locale/translations';
import Link from 'next/link';
import AddToCartButtonWrapper from '@/app/products/[id]/AddToCartButtonWrapper';

// Define types for our data
type ProductVariant = {
  id: string;
  product_id: string;
  domain_id: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: string;
  available: boolean;
};

type Product = {
  id: number;
  name: string;
  description: string;
  category?: string;
  variant?: ProductVariant;
};

type RelatedProduct = {
  id: number;
  name: string;
};

type ProductData = {
  product: Product;
  relatedProducts: RelatedProduct[];
};

// Function to fetch product data from API
async function getProductData(id: string): Promise<ProductData | null> {
  try {
    // Use absolute URL with current host to ensure correct port
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    
    console.log(`Fetching product data from: ${baseUrl}/api/products/${id}`);
    
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching product: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Product data received:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Get translations
  const { t } = await getTranslations(translations);
  
  // Fetch product data using API
  const data = await getProductData(params.id);
  
  if (!data || !data.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:underline">
            ← {t('backToProducts') || 'Terug naar producten'}
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h1 className="text-xl font-bold mb-2">{t('productNotFound') || 'Product niet gevonden'}</h1>
          <p className="text-yellow-600">{t('productNotFoundDesc') || 'Het opgevraagde product kon niet worden gevonden.'}</p>
        </div>
      </div>
    );
  }
  
  // Extract product and variant from the response
  const product = data.product;
  const variant = product.variant; // The variant is nested inside the product object
  
  // Debug logs to help diagnose the issue
  console.log('Product data in page component:', product);
  console.log('Variant data in page component:', variant);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← {t('backToProducts') || 'Terug naar producten'}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Product afbeelding
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          {variant && variant.available !== false ? (
            <>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                €{variant.price.toFixed(2)}
              </div>
              
              <div className="mb-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                  variant.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {variant.stock_quantity > 0 
                    ? `${variant.stock_quantity} ${t('inStock') || 'op voorraad'}`
                    : t('outOfStock') || 'Niet op voorraad'
                  }
                </div>
                
                {/* Show note if using variant from another domain */}
                {variant.domain_id !== await getDomainId() && (
                  <div className="mt-2 text-sm text-gray-500">
                    {t('usingFallbackVariant') || 'Prijzen worden getoond van een andere regio.'}
                  </div>
                )}
              </div>
              
              <div className="prose dark:prose-invert mb-8">
                <p>{product.description}</p>
              </div>
              
              {variant.stock_quantity > 0 && (
                <AddToCartButtonWrapper 
                  product={product} 
                  variant={variant} 
                  buttonText={t('addToCart') || 'In winkelwagen'} 
                />
              )}
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-600">
                {t('productNotAvailableInRegion') || 'Dit product is niet beschikbaar in jouw regio.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products Section */}
      {data.relatedProducts && data.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('relatedProducts') || 'Gerelateerde producten'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.relatedProducts.map((relatedProduct: RelatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                href={`/products/${relatedProduct.id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                {relatedProduct.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
