import Link from 'next/link';

// Tijdelijke pagina die geen fouten veroorzaakt tijdens de build
export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Terug naar producten
        </Link>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p className="text-yellow-600">Deze pagina is tijdelijk niet beschikbaar.</p>
      </div>
    </div>
  );
}
