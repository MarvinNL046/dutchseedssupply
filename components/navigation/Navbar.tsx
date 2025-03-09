'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';
import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import DomainLanguageSwitcher from '@/components/DomainLanguageSwitcher';

export default function Navbar() {
  const { totalItems } = useCart();
  const { t } = useClientTranslations(translations);
  
  return (
    <nav className="bg-gradient-to-r from-white to-green-50 dark:from-green-950 dark:to-green-900 shadow-md border-b border-green-100 dark:border-green-800">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
              Dutch Seed Supply
            </Link>
            <div className="ml-10 hidden md:flex items-center space-x-4">
              <Link href="/products" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                {t('products') || 'Products'}
              </Link>
              {/* Add more navigation links here */}
            </div>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Language switcher (small version) */}
            <div className="hidden md:block">
              <div className="p-1 rounded-md bg-green-50 dark:bg-green-900">
                <DomainLanguageSwitcher />
              </div>
            </div>
            
            {/* Cart link with item count */}
            <Link 
              href="/cart" 
              className="relative p-2 text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User account */}
            <Link 
              href="/login" 
              className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
