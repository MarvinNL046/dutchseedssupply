'use client';

import * as React from 'react';
import Link from 'next/link';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

// Create a context to share the closeDropdown function
const DropdownContext = React.createContext<{
  closeDropdown: () => void;
}>({
  closeDropdown: () => {},
});

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 ${
            align === 'right' ? 'right-0' : 'left-0'
          } bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[200px] border border-gray-200 dark:border-gray-700`}
        >
          <DropdownContext.Provider value={{ closeDropdown: () => setIsOpen(false) }}>
            {children}
          </DropdownContext.Provider>
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className = '', 
  href
}: DropdownMenuItemProps) {
  const { closeDropdown } = React.useContext(DropdownContext);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDropdown();
  };

  // If it's a link, render a Next.js Link
  if (href) {
    return (
      <Link 
        href={href} 
        className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        onClick={closeDropdown}
      >
        {children}
      </Link>
    );
  }
  
  // Regular dropdown item with click handler
  return (
    <div 
      className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>;
}
