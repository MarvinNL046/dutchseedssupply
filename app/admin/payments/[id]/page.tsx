import Link from 'next/link';

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
