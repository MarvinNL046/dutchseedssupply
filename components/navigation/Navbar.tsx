'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartContext';
import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import DomainLanguageSwitcher from '@/components/DomainLanguageSwitcher';
import { useAuth } from '@/components/auth/AuthContext';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast';

export default function Navbar() {
  const { totalItems } = useCart();
  const { t } = useClientTranslations(translations);
  const { user, isAuthenticated, isAdmin, signOut, isLoading } = useAuth();
  const { addToast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      addToast('Je bent succesvol uitgelogd', 'success');
    } catch (error) {
      console.error('Error signing out:', error);
      addToast('Er is een fout opgetreden bij het uitloggen', 'error');
    }
  };
  
  return (
    <nav className="bg-gradient-to-r from-white to-green-50 dark:from-green-950 dark:to-green-900 shadow-md border-b border-green-100 dark:border-green-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/dutchseedsupply-transaparante-achtergrond.png" 
                alt="Dutch Seed Supply Logo" 
                width={240} 
                height={80} 
                className="h-16 w-auto"
                priority
              />
            </Link>
            <div className="ml-12 hidden md:flex items-center space-x-6">
              <Link href="/products" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                {t('products') || 'Products'}
              </Link>
              <Link href="/products?category=indica" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Indica
              </Link>
              <Link href="/products?category=sativa" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Sativa
              </Link>
              <Link href="/products?category=hybrid" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Hybrid
              </Link>
              <Link href="/faq" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                FAQ
              </Link>
              <Link href="/contact" className="text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="hidden md:block">
              <div className="p-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
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
            {isLoading ? (
              <div className="h-6 w-6 rounded-full animate-pulse bg-gray-300 dark:bg-gray-700"></div>
            ) : isAuthenticated ? (
              <DropdownMenu
                trigger={
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300 font-semibold cursor-pointer">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                }
              >
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  {user?.email}
                </div>
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem href="/admin">
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem href="/dashboard/">
                  Mijn Account
                </DropdownMenuItem>
                
                <DropdownMenuItem href="/dashboard/orders/">
                  Mijn Bestellingen
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenu>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
