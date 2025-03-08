'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the response data type
interface AdminCheckResponse {
  isAdmin: boolean;
  message: string;
}

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Debug display
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        console.log('Checking admin status...');
        console.log('Cookies:', document.cookie);
        
        setDebugInfo(prev => prev + 'Checking admin status...\n');
        
        const response = await fetch('/api/auth/check-admin', {
          credentials: 'include', // Important: include cookies in the request
        });
        
        console.log('Admin check response status:', response.status);
        setDebugInfo(prev => prev + `Admin check response status: ${response.status}\n`);
        
        const responseText = await response.text();
        console.log('Admin check response text:', responseText);
        
        let data: AdminCheckResponse;
        try {
          data = JSON.parse(responseText) as AdminCheckResponse;
          console.log('Admin check response data:', data);
          setDebugInfo(prev => prev + `Admin check response data: ${JSON.stringify(data)}\n`);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          setDebugInfo(prev => prev + `Error parsing JSON: ${e}\n`);
          // Use window.location for a hard redirect to login
          window.location.href = '/login';
          return;
        }
        
        if (!response.ok) {
          // If response is not OK, redirect to login
          console.error('Admin check failed:', responseText);
          setDebugInfo(prev => prev + `Admin check failed: ${responseText}\n`);
          
          // Use window.location for a hard redirect to login
          window.location.href = '/login';
          return;
        }
        
        if (data.isAdmin) {
          console.log('Admin status confirmed');
          setDebugInfo(prev => prev + 'Admin status confirmed\n');
          setIsAdmin(true);
        } else {
          console.error('Not an admin user');
          setDebugInfo(prev => prev + 'Not an admin user\n');
          
          // Use window.location for a hard redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setDebugInfo(prev => prev + `Error checking admin status: ${error}\n`);
        
        // Use window.location for a hard redirect to login
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Bezig met laden...</p>
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="mt-4 text-sm text-blue-500 underline"
          >
            {showDebug ? 'Verberg debug info' : 'Toon debug info'}
          </button>
          
          {showDebug && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-h-96 w-full max-w-lg">
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {debugInfo || 'Geen debug informatie beschikbaar.'}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will never render because we redirect in the useEffect
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => setShowDebug(!showDebug)} 
          className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full shadow-md"
          title="Debug info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zm4.577 2.123a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM6.737 6.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm12.293 3.293a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zm-14 0a1 1 0 011.414 1.414l-.707-.707a1 1 0 01-1.414-1.414l.707.707zm12-10a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM6.737 15.657a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" clipRule="evenodd" />
          </svg>
        </button>
        
        {showDebug && (
          <div className="absolute bottom-12 right-0 p-4 bg-white dark:bg-gray-800 rounded shadow-lg w-96 max-h-96 overflow-auto">
            <h3 className="font-bold mb-2">Debug Informatie</h3>
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {debugInfo || 'Geen debug informatie beschikbaar.'}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
