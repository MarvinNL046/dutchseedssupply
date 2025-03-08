import Link from 'next/link';

// Genereer statische parameters voor de statische export
export function generateStaticParams() {
  // Genereer een lijst van payment IDs die statisch gebouwd moeten worden
  // Voor nu gebruiken we een paar dummy IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

// Maak de pagina statisch
export const dynamic = 'force-static';

// Tijdelijke pagina die geen fouten veroorzaakt tijdens de build
export default function AdminPaymentDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <h1 className="text-xl font-bold mb-2">Betaling ID: {params.id}</h1>
        <p className="text-yellow-600">Deze pagina is tijdelijk niet beschikbaar.</p>
      </div>
      <Link href="/admin/payments" className="text-blue-600 hover:underline">
        ← Terug naar betalingsbeheer
      </Link>
    </div>
  );
}
