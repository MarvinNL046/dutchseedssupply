'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserAuthCheck from '@/components/user/UserAuthCheck';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const navItems = [
    { name: 'Overzicht', href: '/dashboard/' },
    { name: 'Bestellingen', href: '/dashboard/orders/' },
    { name: 'Profiel', href: '/dashboard/profile/' },
    { name: 'Loyalty Punten', href: '/dashboard/loyalty/' },
    { name: 'Wachtwoord', href: '/dashboard/password/' },
  ];

  return (
    <UserAuthCheck>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mijn Account</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Terug naar winkel
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                <div className="text-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto">
                    U
                  </div>
                  <p className="mt-2 font-medium text-gray-900 dark:text-white">Gebruiker</p>
                </div>
                
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/');
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Uitloggen
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserAuthCheck>
  );
}
