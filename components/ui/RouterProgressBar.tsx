'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

// Add NProgress styles
const npProgressStyles = `
  #nprogress {
    pointer-events: none;
  }
  
  #nprogress .bar {
    background: #10b981;
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }
  
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #10b981, 0 0 5px #10b981;
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }
`;

export function RouterProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Add NProgress styles to the document
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = npProgressStyles;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);

  useEffect(() => {
    // Start the progress bar
    NProgress.start();
    
    // Complete the progress bar after a short delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
