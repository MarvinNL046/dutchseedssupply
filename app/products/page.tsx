import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

// Define types for our data
type Product = {
  id: number;
  name: string;
  description: string;
};

type ProductVariant = {
  product_id: number;
  domain_id: string;
  price: number;
  stock: number;
  products: Product;
};

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/products`, {
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
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

export default async function ProductsPage() {
  // Get translations
  const { t } = await getTranslations(translations);
  
  // Fetch products using the API route
  const variants = await getProducts();
  
  if (!variants || variants.length === 0) {
    console.error('No products found or error fetching products');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('products') || 'Producten'}</h1>
      
      {variants && variants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((variant: ProductVariant) => (
            <ProductCard key={variant.product_id} variant={variant} />
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

function ProductCard({ variant }: { variant: ProductVariant }) {
  const { products: product, price, stock } = variant;
  
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Product afbeelding
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">€{price.toFixed(2)}</span>
            <span className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock > 0 ? `${stock} op voorraad` : 'Niet op voorraad'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
