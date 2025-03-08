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
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              Dutch Seed Supply
            </Link>
            <div className="ml-10 hidden md:flex items-center space-x-4">
              <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                {t('products') || 'Products'}
              </Link>
              {/* Add more navigation links here */}
            </div>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Language switcher (small version) */}
            <div className="hidden md:block">
              <DomainLanguageSwitcher />
            </div>
            
            {/* Cart link with item count */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
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
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User account */}
            <Link 
              href="/login" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
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
