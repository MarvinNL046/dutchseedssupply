import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import Link from 'next/link';
import WholesaleForm from './WholesaleForm';

export default async function WholesalePage({
  searchParams,
}: {
  searchParams: { product?: string; name?: string };
}) {
  // Get translations and locale
  const { t, locale } = await getTranslations(translations);
  
  // Get product info from query params
  const productId = searchParams.product;
  const productName = searchParams.name;
  
  return (
    <div className="bg-gradient-to-b from-green-50/50 to-white">
      <div className="container mx-auto px-4 py-12">
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
            {productId && (
              <>
                <li>
                  <Link href={`/products/${productId}`} className="text-gray-500 hover:text-green-600 transition-colors">
                    {productName || t('product')}
                  </Link>
                </li>
                <li className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              </>
            )}
            <li className="text-green-600 font-medium">
              {locale === 'en' ? 'Wholesale' : 
               locale === 'nl' ? 'Groothandel' : 
               locale === 'de' ? 'Großhandel' : 
               'Vente en gros'}
            </li>
          </ol>
        </nav>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-green-600 px-6 py-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                {locale === 'en' ? 'Wholesale Inquiry' : 
                 locale === 'nl' ? 'Groothandel Aanvraag' : 
                 locale === 'de' ? 'Großhandelsanfrage' : 
                 'Demande de Vente en Gros'}
              </h1>
              <p className="text-green-100">
                {locale === 'en' ? 'Fill out the form below to request wholesale pricing (1000+ seeds)' : 
                 locale === 'nl' ? 'Vul het onderstaande formulier in om groothandelsprijzen aan te vragen (1000+ zaden)' : 
                 locale === 'de' ? 'Füllen Sie das untenstehende Formular aus, um Großhandelspreise anzufordern (1000+ Samen)' : 
                 'Remplissez le formulaire ci-dessous pour demander des prix de gros (1000+ graines)'}
              </p>
            </div>
            
            <div className="p-6">
              <WholesaleForm 
                productName={productName}
                locale={locale}
              />
            </div>
          </div>
          
          <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              {locale === 'en' ? 'Why Choose Us for Wholesale?' : 
               locale === 'nl' ? 'Waarom Kiezen voor Onze Groothandel?' : 
               locale === 'de' ? 'Warum Uns für den Großhandel Wählen?' : 
               'Pourquoi Nous Choisir pour le Gros?'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {locale === 'en' ? 'Premium Quality Seeds' : 
                     locale === 'nl' ? 'Premium Kwaliteit Zaden' : 
                     locale === 'de' ? 'Premium Qualität Samen' : 
                     'Graines de Qualité Premium'}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {locale === 'en' ? 'High germination rates and consistent quality' : 
                     locale === 'nl' ? 'Hoge kiempercentages en consistente kwaliteit' : 
                     locale === 'de' ? 'Hohe Keimraten und gleichbleibende Qualität' : 
                     'Taux de germination élevés et qualité constante'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {locale === 'en' ? 'Competitive Pricing' : 
                     locale === 'nl' ? 'Concurrerende Prijzen' : 
                     locale === 'de' ? 'Wettbewerbsfähige Preise' : 
                     'Prix Compétitifs'}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {locale === 'en' ? 'Volume discounts and flexible payment terms' : 
                     locale === 'nl' ? 'Volumekortingen en flexibele betalingsvoorwaarden' : 
                     locale === 'de' ? 'Mengenrabatte und flexible Zahlungsbedingungen' : 
                     'Remises sur volume et conditions de paiement flexibles'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {locale === 'en' ? 'Fast & Discreet Shipping' : 
                     locale === 'nl' ? 'Snelle & Discrete Verzending' : 
                     locale === 'de' ? 'Schneller & Diskreter Versand' : 
                     'Expédition Rapide & Discrète'}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {locale === 'en' ? 'Worldwide shipping with tracking and insurance' : 
                     locale === 'nl' ? 'Wereldwijde verzending met tracking en verzekering' : 
                     locale === 'de' ? 'Weltweiter Versand mit Tracking und Versicherung' : 
                     'Expédition mondiale avec suivi et assurance'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {locale === 'en' ? 'Dedicated Support' : 
                     locale === 'nl' ? 'Toegewijde Ondersteuning' : 
                     locale === 'de' ? 'Engagierter Support' : 
                     'Support Dédié'}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {locale === 'en' ? 'Personal account manager for all your needs' : 
                     locale === 'nl' ? 'Persoonlijke accountmanager voor al uw behoeften' : 
                     locale === 'de' ? 'Persönlicher Account-Manager für alle Ihre Bedürfnisse' : 
                     'Gestionnaire de compte personnel pour tous vos besoins'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
