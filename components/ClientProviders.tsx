'use client';

import { ReactNode, useEffect } from 'react';
import { CartProvider } from './cart/CartContext';

// This component provides client-side context providers
// and ensures hydration consistency for i18n
export default function ClientProviders({ 
  children 
}: { 
  children: ReactNode 
}) {
  // Ensure localStorage is synchronized with the cookie value on initial client render
  // This helps prevent hydration mismatches with i18n
  useEffect(() => {
    // Get locale from cookie
    const getCookieLocale = () => {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'NEXT_LOCALE') {
          return value;
        }
      }
      return null;
    };
    
    const cookieLocale = getCookieLocale();
    const localStorageLocale = localStorage.getItem('NEXT_LOCALE');
    
    // If cookie locale exists and differs from localStorage, update localStorage
    if (cookieLocale && cookieLocale !== localStorageLocale) {
      localStorage.setItem('NEXT_LOCALE', cookieLocale);
    }
  }, []);
  
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
