'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/CartContext';
import { AuthProvider } from '@/components/auth/AuthContext';
import { ToastProvider } from '@/components/ui/toast';

export default function ClientProviders({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
