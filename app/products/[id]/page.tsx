import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import Link from 'next/link';
import ProductActions from './ProductActions';

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
  package_size?: number; // Added package_size field
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
  
  // Log related products for debugging
  console.log('Related products:', data?.relatedProducts);
  
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
        
        {/* Main Product Section - Image and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
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
          
          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            {/* Product Title */}
            <h1 className="text-4xl font-bold mb-2 text-gray-800">{product.name}</h1>
            
            {/* Category Badge */}
            {product.category && (
              <Link 
                href={`/category/${product.category.toLowerCase()}`}
                className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium text-white ${
                  product.category.toLowerCase() === 'indica' ? 'bg-purple-600 hover:bg-purple-700' :
                  product.category.toLowerCase() === 'sativa' ? 'bg-green-600 hover:bg-green-700' :
                  product.category.toLowerCase() === 'hybrid' ? 'bg-blue-600 hover:bg-blue-700' :
                  product.category.toLowerCase() === 'autoflowering' ? 'bg-amber-600 hover:bg-amber-700' :
                  product.category.toLowerCase() === 'feminized' ? 'bg-pink-600 hover:bg-pink-700' :
                  product.category.toLowerCase() === 'cbd' ? 'bg-teal-600 hover:bg-teal-700' :
                  product.category.toLowerCase() === 'usa' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-gray-600 hover:bg-gray-700'
                } transition-colors`}
              >
                {product.category}
              </Link>
            )}
            
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
                
                {/* Shipping Information */}
                <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
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
                
                {/* Product Actions - Package Size Selector, Add to Cart Button, Wholesale Button */}
                <div className="mb-8">
                  <ProductActions
                    product={product}
                    variants={[
                      { ...variant, package_size: 3 },
                      { ...variant, id: `${variant.id}-5`, package_size: 5, price: variant.price * 1.5 },
                      { ...variant, id: `${variant.id}-10`, package_size: 10, price: variant.price * 2.5 }
                    ]}
                    buttonText={t('addToCart') || 'In winkelwagen'}
                    locale={locale}
                  />
                </div>
                
                {/* Short Description */}
                <div className="prose prose-green max-w-none mb-8">
                  <p>{product.description}</p>
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
        
        {/* Reviews and Trust Badges Section */}
        <div className="mb-12 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Reviews */}
            <div>
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
              </div>
            </div>
            
            {/* Trust Signals */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {locale === 'en' ? 'Why Shop With Us' : locale === 'nl' ? 'Waarom Bij Ons Kopen' : locale === 'de' ? 'Warum Bei Uns Kaufen' : 'Pourquoi Acheter Chez Nous'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {locale === 'en' ? 'Secure Payment' : locale === 'nl' ? 'Veilig Betalen' : locale === 'de' ? 'Sichere Zahlung' : 'Paiement Sécurisé'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {locale === 'en' ? 'All transactions are encrypted and secure' : 
                       locale === 'nl' ? 'Alle transacties zijn versleuteld en veilig' : 
                       locale === 'de' ? 'Alle Transaktionen sind verschlüsselt und sicher' : 
                       'Toutes les transactions sont cryptées et sécurisées'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* You Might Also Like These Seeds Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            {locale === 'en' ? 'You Might Also Like These Seeds' : 
             locale === 'nl' ? 'Misschien Zijn Deze Zaden Ook Iets Voor Jou' : 
             locale === 'de' ? 'Diese Samen Könnten Dir Auch Gefallen' : 
             'Ces Graines Pourraient Aussi Vous Plaire'}
          </h2>
          
          {data.relatedProducts && data.relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.relatedProducts.slice(0, 4).map((relatedProduct: RelatedProduct) => (
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
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                {locale === 'en' ? 'No related products found.' : 
                 locale === 'nl' ? 'Geen gerelateerde producten gevonden.' : 
                 locale === 'de' ? 'Keine verwandten Produkte gefunden.' : 
                 'Aucun produit connexe trouvé.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
