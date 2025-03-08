import Link from 'next/link';

// Tijdelijke pagina die geen fouten veroorzaakt tijdens de build
export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto py-12 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="text-green-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Bedankt voor je bestelling!</h1>
        <p className="mb-6">Je betaling is succesvol verwerkt.</p>
        <p className="mb-6">Je ontvangt binnenkort een bevestigingsmail.</p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Terug naar de homepage
          </Link>
          
          <Link 
            href="/products" 
            className="text-blue-600 hover:underline"
          >
            Verder winkelen
          </Link>
        </div>
      </div>
    </div>
  );
}
