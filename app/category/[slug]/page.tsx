import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import { notFound } from 'next/navigation';

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

// Define valid categories
const validCategories = [
  'indica',
  'sativa',
  'hybrid',
  'autoflowering',
  'feminized',
  'cbd',
  'usa',
  'f1-hybrids'
];

// Function to get category display name
function getCategoryDisplayName(slug: string): string {
  const categoryMap: Record<string, string> = {
    'indica': 'Indica',
    'sativa': 'Sativa',
    'hybrid': 'Hybrid',
    'autoflowering': 'Autoflowering',
    'feminized': 'Feminized',
    'cbd': 'CBD',
    'usa': 'USA',
    'f1-hybrids': 'F1-Hybrids'
  };
  
  return categoryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

// Function to get category description
function getCategoryDescription(slug: string, locale: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    'indica': {
      'en': 'Relaxing & calming strains perfect for evening use and stress relief.',
      'nl': 'Ontspannende en kalmerende soorten, perfect voor avondgebruik en stressverlichting.',
      'de': 'Entspannende und beruhigende Sorten, perfekt für den Abendgebrauch und Stressabbau.',
      'fr': 'Variétés relaxantes et apaisantes, parfaites pour une utilisation en soirée et pour soulager le stress.'
    },
    'sativa': {
      'en': 'Energizing & uplifting varieties for daytime use and creativity.',
      'nl': 'Energieke en opwekkende variëteiten voor gebruik overdag en creativiteit.',
      'de': 'Energetisierende und aufmunternde Sorten für den Tagesgebrauch und Kreativität.',
      'fr': 'Variétés énergisantes et stimulantes pour une utilisation diurne et la créativité.'
    },
    'hybrid': {
      'en': 'Balanced effects & characteristics combining the best of Indica and Sativa.',
      'nl': 'Gebalanceerde effecten en eigenschappen die het beste van Indica en Sativa combineren.',
      'de': 'Ausgewogene Wirkungen und Eigenschaften, die das Beste von Indica und Sativa vereinen.',
      'fr': 'Effets et caractéristiques équilibrés combinant le meilleur de l\'Indica et de la Sativa.'
    },
    'autoflowering': {
      'en': 'Quick & easy to grow varieties that automatically flower regardless of light cycle.',
      'nl': 'Snelle en gemakkelijk te kweken variëteiten die automatisch bloeien, ongeacht de lichtcyclus.',
      'de': 'Schnelle und einfach anzubauende Sorten, die unabhängig vom Lichtzyklus automatisch blühen.',
      'fr': 'Variétés rapides et faciles à cultiver qui fleurissent automatiquement, quel que soit le cycle lumineux.'
    },
    'feminized': {
      'en': 'Guaranteed female plants that produce the buds you want without male plants.',
      'nl': 'Gegarandeerd vrouwelijke planten die de gewenste toppen produceren zonder mannelijke planten.',
      'de': 'Garantiert weibliche Pflanzen, die die gewünschten Knospen produzieren, ohne männliche Pflanzen.',
      'fr': 'Plantes femelles garanties qui produisent les bourgeons souhaités sans plantes mâles.'
    },
    'cbd': {
      'en': 'High CBD, low THC options for medicinal benefits without strong psychoactive effects.',
      'nl': 'Hoge CBD, lage THC-opties voor medicinale voordelen zonder sterke psychoactieve effecten.',
      'de': 'Hoher CBD-Gehalt, niedrige THC-Optionen für medizinische Vorteile ohne starke psychoaktive Wirkungen.',
      'fr': 'Options à haute teneur en CBD et faible en THC pour des bienfaits médicinaux sans effets psychoactifs forts.'
    },
    'usa': {
      'en': 'Premium American genetics with unique flavors and effects from the USA.',
      'nl': 'Premium Amerikaanse genetica met unieke smaken en effecten uit de VS.',
      'de': 'Premium amerikanische Genetik mit einzigartigen Aromen und Wirkungen aus den USA.',
      'fr': 'Génétique américaine premium avec des saveurs et des effets uniques des États-Unis.'
    },
    'f1-hybrids': {
      'en': 'First generation crosses offering superior growth, yield, and uniformity through heterosis (hybrid vigor).',
      'nl': 'Eerste generatie kruisingen die superieure groei, opbrengst en uniformiteit bieden door heterosis (hybride kracht).',
      'de': 'Kreuzungen der ersten Generation, die durch Heterosis (Hybridkraft) überlegenes Wachstum, Ertrag und Gleichmäßigkeit bieten.',
      'fr': 'Croisements de première génération offrant une croissance, un rendement et une uniformité supérieurs grâce à l\'hétérosis (vigueur hybride).'
    }
  };
  
  return descriptions[slug]?.[locale] || descriptions[slug]?.['en'] || '';
}

// Function to get category color
function getCategoryColor(slug: string): string {
  const colorMap: Record<string, string> = {
    'indica': 'purple',
    'sativa': 'green',
    'hybrid': 'blue',
    'autoflowering': 'amber',
    'feminized': 'pink',
    'cbd': 'teal',
    'usa': 'red',
    'f1-hybrids': 'violet'
  };
  
  return colorMap[slug] || 'gray';
}

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

export default async function CategoryPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Get the category slug from the URL
  const { slug } = params;
  
  // Check if it's a valid category
  if (!validCategories.includes(slug.toLowerCase())) {
    notFound();
  }
  
  // Get translations
  const { t, locale } = await getTranslations(translations);
  
  // Get category display name and description
  const categoryName = getCategoryDisplayName(slug);
  const categoryDescription = getCategoryDescription(slug, locale);
  const categoryColor = getCategoryColor(slug);
  
  // Fetch products using the API route with category filter
  const products = await getProducts({
    category: slug
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className={`mb-8 p-6 rounded-xl bg-${categoryColor}-50 border border-${categoryColor}-100`}>
        <h1 className={`text-3xl font-bold mb-2 text-${categoryColor}-800`}>{categoryName}</h1>
        <p className={`text-${categoryColor}-700`}>{categoryDescription}</p>
      </div>
      
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/products" className="text-gray-500 hover:text-green-600 transition-colors">
              {t('products') || 'Producten'}
            </Link>
          </li>
          <li className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className={`text-${categoryColor}-600 font-medium`}>{categoryName}</li>
        </ol>
      </nav>
      
      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {t('noProductsFound') || 'Geen producten gevonden in deze categorie.'}
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
