import Link from 'next/link';

// Tijdelijke pagina die geen fouten veroorzaakt tijdens de build
export default function CheckoutFailurePage() {
  return (
    <div className="container mx-auto py-12 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Betaling niet gelukt</h1>
        <p className="mb-6">Er is een probleem opgetreden bij het verwerken van je betaling.</p>
        <p className="mb-6">Probeer het opnieuw of neem contact op met onze klantenservice.</p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/cart" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Terug naar winkelwagen
          </Link>
          
          <Link 
            href="/contact" 
            className="text-blue-600 hover:underline"
          >
            Contact klantenservice
          </Link>
        </div>
      </div>
    </div>
  );
}
