import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

// Define types for our data
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: string;
  featured: boolean;
  images: string[];
  slug: string;
  sku: string;
  thc_content?: number;
  cbd_content?: number;
  flowering_time?: number;
  height?: string;
  yield?: string;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

async function getProducts(params: Record<string, string> = {}) {
  try {
    // Build URL with query parameters
    const url = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/products/`);
    
    // Add all params to the URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    
    const response = await fetch(url.toString(), {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  // Get translations
  const { t } = await getTranslations(translations);
  
  // Extract search parameters
  const category = searchParams.category as string;
  const search = searchParams.search as string;
  const featured = searchParams.featured as string;
  
  // Fetch products using the API route with filters
  const products = await getProducts({
    category,
    search,
    featured
  });
  
  if (!products || products.length === 0) {
    console.error('No products found or error fetching products');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('products') || 'Producten'}</h1>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {t('noProductsFound') || 'Geen producten gevonden voor deze regio.'}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  // Use sale_price if available, otherwise use regular price
  const displayPrice = product.sale_price || product.price;
  const isOnSale = product.sale_price && product.sale_price < product.price;
  
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Product afbeelding
          </div>
          
          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          
          {/* Sale badge */}
          {isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <div>
              {isOnSale ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-red-600">€{displayPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">€{product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold">€{displayPrice.toFixed(2)}</span>
              )}
            </div>
            <span className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} op voorraad` : 'Niet op voorraad'}
            </span>
          </div>
          
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.categories.map((category, index) => (
                <span key={index} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
