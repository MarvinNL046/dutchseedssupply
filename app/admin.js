'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase-browser';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const supabase = createBrowserClient();
    
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session check in admin.js:', session);
        
        if (!session) {
          console.log('No session found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('Session found for user:', session.user.email);
        setUser(session.user);
        
        // Simplified admin check - just check for known admin email
        if (session.user.email === 'marvinsmit1988@gmail.com') {
          console.log('Known admin email detected, allowing access');
          setLoading(false);
          return; // Allow access
        }
        
        // Only try to check database role if we're not the known admin
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (userError || !userData || userData.role !== 'admin') {
            console.log('User is not admin, redirecting to home');
            router.push('/');
            return;
          }
          
          console.log('Admin role confirmed from database');
        } catch (err) {
          console.error('Error checking user role:', err);
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
  }, [router]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
        <h1 className="text-2xl font-bold mb-4">Welkom, admin!</h1>
        {user && <p className="mb-4">Ingelogd als: {user.email}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recente bestellingen</h2>
            <p className="text-gray-600 dark:text-gray-300">Bekijk en beheer recente bestellingen.</p>
            <Link href="/admin/orders" className="mt-4 inline-block text-blue-500 hover:underline">Bekijk bestellingen →</Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Productbeheer</h2>
            <p className="text-gray-600 dark:text-gray-300">Voeg producten toe, bewerk of verwijder ze.</p>
            <Link href="/admin/products" className="mt-4 inline-block text-blue-500 hover:underline">Beheer producten →</Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gebruikersbeheer</h2>
            <p className="text-gray-600 dark:text-gray-300">Beheer gebruikersaccounts en rechten.</p>
            <Link href="/admin/users" className="mt-4 inline-block text-blue-500 hover:underline">Beheer gebruikers →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
