'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch('/api/auth/check-admin');
        
        if (!response.ok) {
          // If response is not OK, redirect to login
          console.error('Admin check failed:', await response.text());
          router.push('/login');
          return;
        }
        
        const data = await response.json();
        
        if (data.isAdmin) {
          setIsAdmin(true);
        } else {
          console.error('Not an admin user');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will never render because we redirect in the useEffect
  }

  return <>{children}</>;
}
