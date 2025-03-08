import Link from 'next/link';

// Genereer statische parameters voor de statische export
export function generateStaticParams() {
  // Genereer een lijst van product IDs die statisch gebouwd moeten worden
  // Voor nu gebruiken we een paar dummy IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

// Maak de pagina statisch
export const dynamic = 'force-static';

// Tijdelijke pagina die geen fouten veroorzaakt tijdens de build
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Terug naar producten
        </Link>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <h1 className="text-xl font-bold mb-2">Product ID: {params.id}</h1>
        <p className="text-yellow-600">Deze pagina is tijdelijk niet beschikbaar.</p>
      </div>
    </div>
  );
}
