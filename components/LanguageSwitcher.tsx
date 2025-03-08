'use client';

import { useState } from 'react';
import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

const languageNames = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
};

export default function LanguageSwitcher() {
  const { t, locale: initialLocale } = useClientTranslations(translations);
  const [locale] = useState(initialLocale);

  // Update the locale in both localStorage and cookie, then reload the page to apply the change
  const changeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Store the new locale in localStorage
    localStorage.setItem('NEXT_LOCALE', newLocale);
    
    // Set a cookie that will be sent with the next request
    // Use a consistent format with the middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
    
    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-black/30 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">{t('currentLocale')}</h2>
      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(languageNames).map(([code, name]) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              locale === code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
