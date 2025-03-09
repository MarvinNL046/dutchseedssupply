'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if the banner has been dismissed before
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('construction-banner-dismissed');
    if (bannerDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);
  
  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('construction-banner-dismissed', 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="relative bg-amber-500 text-white px-4 py-3 text-center">
      <div className="flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <span className="font-medium">
          This website is currently under construction. Some features may not be available yet.
        </span>
      </div>
      <button 
        onClick={dismissBanner}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-100"
        aria-label="Dismiss banner"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
