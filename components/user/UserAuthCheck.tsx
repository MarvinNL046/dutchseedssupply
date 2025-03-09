'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/ui/toast';

export default function UserAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const hasCheckedAuth = useRef(false);

  // Debug display
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    async function checkUserStatus() {
      // Only check authentication status once
      if (hasCheckedAuth.current) {
        return;
      }
      
      try {
        console.log('Checking user authentication status...');
        setDebugInfo(prev => prev + 'Checking user authentication status...\n');
        
        // Refresh the user data from AuthContext
        await refreshUser();
        hasCheckedAuth.current = true;
        
        // Add debug info about the current auth state
        setDebugInfo(prev => prev + `Auth state: isAuthenticated=${isAuthenticated}, isLoading=${isLoading}\n`);
        
        if (!isLoading && !isAuthenticated) {
          console.log('User not authenticated, redirecting to login...');
          setDebugInfo(prev => prev + 'User not authenticated, redirecting to login...\n');
          
          // Show a toast notification
          addToast('Je moet ingelogd zijn om deze pagina te bekijken', 'info');
          
          // Use router.push instead of window.location for a smoother experience
          router.push('/login');
        } else if (!isLoading && isAuthenticated) {
          console.log('User authenticated:', user?.email);
          setDebugInfo(prev => prev + `User authenticated: ${user?.email}\n`);
        }
      } catch (error) {
        console.error('Error in UserAuthCheck:', error);
        setDebugInfo(prev => prev + `Error in UserAuthCheck: ${error}\n`);
        hasCheckedAuth.current = true;
      }
    }
    
    checkUserStatus();
  }, [isAuthenticated, isLoading, router, user, addToast]);

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

  if (!isAuthenticated) {
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
