import Link from 'next/link';

// Tijdelijke versie zonder server-side authenticatie
// Dit is alleen voor het oplossen van de 500 error
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Geen server-side authenticatie om problemen te voorkomen
  // In productie moet dit worden vervangen door echte authenticatie
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold">Admin Dashboard</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/products" className="hover:text-blue-500">Producten</Link>
            <Link href="/admin/orders" className="hover:text-blue-500">Bestellingen</Link>
            <Link href="/admin/users" className="hover:text-blue-500">Gebruikers</Link>
            <Link href="/" className="hover:text-blue-500">Terug naar site</Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
