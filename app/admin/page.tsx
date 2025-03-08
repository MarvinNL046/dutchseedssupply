import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function AdminPage() {
  // Create Supabase client
  const supabase = await createServerSupabaseClient();
  
  // Get session (we don't need to check admin role here since layout already does that)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">Ingelogd als: {session.user.email}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <DashboardCard 
          title="Producten" 
          description="Beheer producten en varianten" 
          link="/admin/products" 
        />
        <DashboardCard 
          title="Betalingen" 
          description="Bekijk en beheer betalingen" 
          link="/admin/payments" 
        />
        <DashboardCard 
          title="Bestellingen" 
          description="Bekijk en beheer bestellingen" 
          link="/admin/orders" 
        />
        <DashboardCard 
          title="Gebruikers" 
          description="Beheer gebruikers en loyaliteitspunten" 
          link="/admin/users" 
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }: { 
  title: string; 
  description: string; 
  link: string;
}) {
  return (
    <Link 
      href={link}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Link>
  );
}
