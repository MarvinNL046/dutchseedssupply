import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    
    // Create regular client for session check
    const supabase = await createServerSupabaseClient();
    
    // Check session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No session found in admin layout, redirecting to login');
      redirect('/login');
    }
    
    console.log('Session found in admin layout for user:', session.user.email);
    
    try {
      // Create admin client for checking user role
      const adminSupabase = await createServerSupabaseAdminClient();
      
      // Controleer admin-rol met admin client
      const { data: user, error: userError } = await adminSupabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.log('Error fetching user role in admin layout:', userError);
        
        // Als de gebruiker marvinsmit1988@gmail.com is, behandel deze als admin
        if (session.user.email === 'marvinsmit1988@gmail.com') {
          console.log('Using email check for known admin in admin layout');
          // Ga door naar admin pagina
        } else {
          console.log('User is not a known admin in admin layout, redirecting to home');
          redirect('/');
        }
      } else if (!user || user.role !== 'admin') {
        console.log('User is not admin in admin layout, redirecting to home');
        redirect('/');
      } else {
        console.log('Admin role confirmed from database in admin layout');
      }
    } catch (innerError) {
      console.error('Error checking user role in admin layout:', innerError);
      
      // Fallback voor bekende admin
      if (session.user.email === 'marvinsmit1988@gmail.com') {
        console.log('Using email fallback for known admin after error in admin layout');
        // Ga door naar admin pagina
      } else {
        console.log('User is not a known admin in admin layout, redirecting to home after error');
        redirect('/');
      }
    }
    
    console.log('Admin layout rendered for', session.user.email);
  } catch (error) {
    console.error('Error in admin layout:', error);
    redirect('/login');
  }
  
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
