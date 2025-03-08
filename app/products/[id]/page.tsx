import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import Link from 'next/link';
import AddToCartButtonWrapper from '@/app/products/[id]/AddToCartButtonWrapper';

// Define types for our data
type Product = {
  id: number;
  name: string;
  description: string;
  category?: string;
};

type ProductVariant = {
  product_id: number;
  domain_id: string;
  price: number;
  stock: number;
};

type RelatedProduct = {
  id: number;
  name: string;
};

type ProductData = {
  product: Product;
  variant: ProductVariant | null;
  relatedProducts: RelatedProduct[];
};

// Function to fetch product data from API
async function getProductData(id: string): Promise<ProductData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/products/${id}`, {
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.status}`);
    }
    
    return await response.json();
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
  
  const { product, variant } = data;
  
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
          
          {variant ? (
            <>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                €{variant.price.toFixed(2)}
              </div>
              
              <div className="mb-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                  variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {variant.stock > 0 
                    ? `${variant.stock} ${t('inStock') || 'op voorraad'}`
                    : t('outOfStock') || 'Niet op voorraad'
                  }
                </div>
              </div>
              
              <div className="prose dark:prose-invert mb-8">
                <p>{product.description}</p>
              </div>
              
              {variant.stock > 0 && (
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
