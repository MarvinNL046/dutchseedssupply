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
  thc_content?: number;
  cbd_content?: number;
  flowering_time?: number;
  height?: string;
  yield?: string;
  images?: { url: string; alt: string }[];
};

type RelatedProduct = {
  id: number;
  name: string;
  images?: { url: string; alt: string }[];
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
  // Get translations and locale
  const { t, locale } = await getTranslations(translations);
  
  // Fetch product data using API
  const data = await getProductData(params.id);
  
  if (!data || !data.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-2 transition-colors duration-200 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>{t('backToProducts') || 'Terug naar producten'}</span>
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-3 text-yellow-800">{t('productNotFound') || 'Product niet gevonden'}</h1>
          <p className="text-yellow-700">{t('productNotFoundDesc') || 'Het opgevraagde product kon niet worden gevonden.'}</p>
        </div>
      </div>
    );
  }
  
  // Extract product and variant from the response
  const product = data.product;
  const variant = product.variant; // The variant is nested inside the product object
  
  // Default image if none provided
  const defaultImage = {
    url: "https://images.unsplash.com/photo-1603916072034-8a2f2a6307e3",
    alt: product.name
  };
  
  // Use the first image or default
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : defaultImage;
  
  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <div className="bg-gradient-to-b from-green-50/50 to-white">
      <div className="container mx-auto px-4 py-8">
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
            <li className="text-green-600 font-medium">{product.name}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
              <img 
                src={mainImage.url} 
                alt={mainImage.alt || product.name}
                className="object-cover w-full h-full z-10 relative"
              />
              
              {/* Badges */}
              {variant && variant.sale_price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  {Math.round((1 - variant.sale_price / variant.price) * 100)}% {t('discount')}
                </div>
              )}
              
              {product.thc_content && product.thc_content > 20 && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  {t('highTHC')}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-green-500' : 'border-transparent'} hover:border-green-300 transition-colors cursor-pointer`}>
                    <img 
                      src={img.url} 
                      alt={img.alt || `${product.name} - image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="sticky top-24">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
              
              {variant && variant.available !== false ? (
                <>
                  {/* Price Section */}
                  <div className="mb-6">
                    {variant.sale_price ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-green-600">
                          {formatPrice(variant.sale_price)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-green-600">
                        {formatPrice(variant.price)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className="mb-8">
                    {variant.stock_quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          variant.stock_quantity > 10 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`font-medium ${
                          variant.stock_quantity > 10 ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          {variant.stock_quantity} {t('inStock') || 'op voorraad'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium text-red-700">
                          {t('outOfStock') || 'Niet op voorraad'}
                        </span>
                      </div>
                    )}
                    
                    {/* Show note if using variant from another domain */}
                    {variant.domain_id !== await getDomainId() && (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        {t('usingFallbackVariant') || 'Prijzen worden getoond van een andere regio.'}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Specifications */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('productSpecifications')}</h3>
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm">
                      {product.thc_content !== undefined && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{t('thcContent')}</span>
                          <span className="font-medium">{product.thc_content}%</span>
                        </div>
                      )}
                      
                      {product.cbd_content !== undefined && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{t('cbdContent')}</span>
                          <span className="font-medium">{product.cbd_content}%</span>
                        </div>
                      )}
                      
                      {product.flowering_time !== undefined && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{t('floweringTime')}</span>
                          <span className="font-medium">{product.flowering_time} {locale === 'en' ? 'days' : locale === 'nl' ? 'dagen' : locale === 'de' ? 'Tage' : 'jours'}</span>
                        </div>
                      )}
                      
                      {product.height && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{t('height')}</span>
                          <span className="font-medium">{product.height}</span>
                        </div>
                      )}
                      
                      {product.yield && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{t('yieldAmount')}</span>
                          <span className="font-medium">{product.yield}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Growing Tips Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('growingTips')}</h3>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-4">
                          <h4 className="font-medium text-green-700 mb-2">{t('indoorGrowing')}</h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• {locale === 'en' ? 'Temperature: 20-26°C' : locale === 'nl' ? 'Temperatuur: 20-26°C' : locale === 'de' ? 'Temperatur: 20-26°C' : 'Température: 20-26°C'}</li>
                            <li>• {locale === 'en' ? 'Humidity: 40-60%' : locale === 'nl' ? 'Luchtvochtigheid: 40-60%' : locale === 'de' ? 'Luftfeuchtigkeit: 40-60%' : 'Humidité: 40-60%'}</li>
                            <li>• {locale === 'en' ? 'Light cycle: 18/6 veg, 12/12 flower' : locale === 'nl' ? 'Lichtcyclus: 18/6 groei, 12/12 bloei' : locale === 'de' ? 'Lichtzyklus: 18/6 Wachstum, 12/12 Blüte' : 'Cycle lumineux: 18/6 croissance, 12/12 floraison'}</li>
                            <li>• {locale === 'en' ? 'Medium: Soil or hydroponics' : locale === 'nl' ? 'Medium: Aarde of hydroponics' : locale === 'de' ? 'Medium: Erde oder Hydrokultur' : 'Milieu: Terre ou hydroponique'}</li>
                          </ul>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-green-700 mb-2">{t('outdoorGrowing')}</h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• {locale === 'en' ? 'Climate: Warm, sunny' : locale === 'nl' ? 'Klimaat: Warm, zonnig' : locale === 'de' ? 'Klima: Warm, sonnig' : 'Climat: Chaud, ensoleillé'}</li>
                            <li>• {locale === 'en' ? 'Planting: Late spring' : locale === 'nl' ? 'Planten: Late lente' : locale === 'de' ? 'Pflanzen: Später Frühling' : 'Plantation: Fin du printemps'}</li>
                            <li>• {locale === 'en' ? 'Harvest: Early autumn' : locale === 'nl' ? 'Oogst: Vroege herfst' : locale === 'de' ? 'Ernte: Früher Herbst' : 'Récolte: Début de l\'automne'}</li>
                            <li>• {locale === 'en' ? 'Protection: Wind and rain' : locale === 'nl' ? 'Bescherming: Wind en regen' : locale === 'de' ? 'Schutz: Wind und Regen' : 'Protection: Vent et pluie'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Effects and Flavors */}
                  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{t('effects')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Euphoric', 'Energetic', 'Creative', 'Uplifting', 'Focused'].map((effect, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{t('flavors')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Citrus', 'Earthy', 'Sweet', 'Pine', 'Spicy'].map((flavor, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Information */}
                  <div className="mb-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.038A2.968 2.968 0 0115 12.995V13a1 1 0 001-1v-2a1 1 0 00-1-1h-3.034A2.968 2.968 0 0110 7.995V8H7v-.963A2.968 2.968 0 019 5h8a1 1 0 001-1V2a1 1 0 00-1-1H3a1 1 0 00-1 1v1a1 1 0 001 1zm0 3h2v2H3V7z" />
                      </svg>
                      <h3 className="font-medium text-blue-800">
                        {locale === 'en' ? 'Free Shipping' : locale === 'nl' ? 'Gratis Verzending' : locale === 'de' ? 'Kostenloser Versand' : 'Livraison Gratuite'}
                      </h3>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {locale === 'en' ? 'Orders placed before 3PM are shipped the same day' : 
                       locale === 'nl' ? 'Bestellingen voor 15:00 uur worden dezelfde dag verzonden' : 
                       locale === 'de' ? 'Bestellungen vor 15 Uhr werden noch am selben Tag verschickt' : 
                       'Les commandes passées avant 15h sont expédiées le jour même'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="prose prose-green max-w-none mb-8">
                    <p>{product.description}</p>
                  </div>
                  
                  {/* Trust Signals */}
                  <div className="mb-8 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-medium text-gray-700">
                        {locale === 'en' ? 'Secure Payment' : locale === 'nl' ? 'Veilig Betalen' : locale === 'de' ? 'Sichere Zahlung' : 'Paiement Sécurisé'}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-xs font-medium text-gray-700">
                        {locale === 'en' ? 'Quality Guarantee' : locale === 'nl' ? 'Kwaliteitsgarantie' : locale === 'de' ? 'Qualitätsgarantie' : 'Garantie Qualité'}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                      </svg>
                      <p className="text-xs font-medium text-gray-700">
                        {locale === 'en' ? '30-Day Returns' : locale === 'nl' ? '30 Dagen Retour' : locale === 'de' ? '30 Tage Rückgabe' : 'Retours 30 Jours'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Customer Reviews */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      {locale === 'en' ? 'Customer Reviews' : locale === 'nl' ? 'Klantbeoordelingen' : locale === 'de' ? 'Kundenbewertungen' : 'Avis Clients'}
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {locale === 'en' ? 'John D.' : locale === 'nl' ? 'Jan D.' : locale === 'de' ? 'Johann D.' : 'Jean D.'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {locale === 'en' ? 'Excellent quality seeds! All germinated within 48 hours. Highly recommended.' : 
                           locale === 'nl' ? 'Uitstekende kwaliteit zaden! Allemaal ontkiemd binnen 48 uur. Sterk aanbevolen.' : 
                           locale === 'de' ? 'Ausgezeichnete Qualität der Samen! Alle keimten innerhalb von 48 Stunden. Sehr empfehlenswert.' : 
                           'Excellente qualité de graines ! Toutes ont germé en 48 heures. Fortement recommandé.'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={i < 4 ? 'currentColor' : 'none'} stroke="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {locale === 'en' ? 'Sarah M.' : locale === 'nl' ? 'Sara M.' : locale === 'de' ? 'Sarah M.' : 'Sarah M.'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {locale === 'en' ? 'Great product, fast shipping. The plants are growing well and look healthy.' : 
                           locale === 'nl' ? 'Geweldig product, snelle verzending. De planten groeien goed en zien er gezond uit.' : 
                           locale === 'de' ? 'Tolles Produkt, schneller Versand. Die Pflanzen wachsen gut und sehen gesund aus.' : 
                           'Excellent produit, livraison rapide. Les plantes poussent bien et semblent en bonne santé.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Sticky at bottom on mobile */}
                  <div className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm py-4 -mx-4 px-4 mt-auto border-t border-gray-200 md:border-0 md:bg-transparent md:backdrop-blur-none">
                    {variant.stock_quantity > 0 ? (
                      <AddToCartButtonWrapper 
                        product={product} 
                        variant={variant} 
                        buttonText={t('addToCart') || 'In winkelwagen'} 
                      />
                    ) : (
                      <button
                        disabled
                        className="w-full px-6 py-3 rounded-md font-medium text-white bg-gray-400 cursor-not-allowed"
                      >
                        {t('outOfStock') || 'Niet op voorraad'}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      {t('productNotAvailableInRegion') || 'Dit product is niet beschikbaar in jouw regio.'}
                    </h3>
                  </div>
                  <p className="text-yellow-700">
                    Bekijk onze andere producten die wel beschikbaar zijn in jouw regio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Frequently Bought Together Section */}
        {data.relatedProducts && data.relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              {locale === 'en' ? 'Frequently Bought Together' : 
               locale === 'nl' ? 'Vaak Samen Gekocht' : 
               locale === 'de' ? 'Wird oft zusammen gekauft' : 
               'Souvent achetés ensemble'}
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                {/* Main product */}
                <div className="w-full md:w-1/4">
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                    <img 
                      src={mainImage.url} 
                      alt={mainImage.alt || product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-green-600 font-medium">
                      {variant && variant.sale_price ? formatPrice(variant.sale_price) : variant && formatPrice(variant.price)}
                    </p>
                  </div>
                </div>
                
                {/* Plus sign */}
                <div className="hidden md:block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                
                {/* Related product 1 */}
                {data.relatedProducts.length > 0 && (
                  <div className="w-full md:w-1/4">
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                      {data.relatedProducts[0].images && data.relatedProducts[0].images.length > 0 ? (
                        <img 
                          src={data.relatedProducts[0].images[0].url} 
                          alt={data.relatedProducts[0].images[0].alt || data.relatedProducts[0].name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="font-medium text-gray-800">{data.relatedProducts[0].name}</h3>
                      <p className="text-green-600 font-medium">€29.99</p>
                    </div>
                  </div>
                )}
                
                {/* Equals sign */}
                <div className="hidden md:block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 18h16" />
                  </svg>
                </div>
                
                {/* Bundle info */}
                <div className="w-full md:w-1/4 bg-green-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {locale === 'en' ? 'Bundle Price' : 
                     locale === 'nl' ? 'Bundel Prijs' : 
                     locale === 'de' ? 'Paketpreis' : 
                     'Prix du lot'}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">€59.99</span>
                    <span className="text-sm text-gray-500 line-through">€64.98</span>
                    <span className="text-sm text-green-700 font-medium">
                      {locale === 'en' ? 'Save 8%' : 
                       locale === 'nl' ? 'Bespaar 8%' : 
                       locale === 'de' ? '8% sparen' : 
                       'Économisez 8%'}
                    </span>
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    {locale === 'en' ? 'Add Bundle to Cart' : 
                     locale === 'nl' ? 'Bundel Toevoegen' : 
                     locale === 'de' ? 'Paket hinzufügen' : 
                     'Ajouter le lot'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Related Products Section */}
        {data.relatedProducts && data.relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">{t('relatedProducts') || 'Gerelateerde producten'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.relatedProducts.map((relatedProduct: RelatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img 
                          src={relatedProduct.images[0].url} 
                          alt={relatedProduct.images[0].alt || relatedProduct.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
