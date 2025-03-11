'use client';

import Link from 'next/link';

type WholesaleButtonProps = {
  productId: number;
  productName: string;
  locale?: string;
};

export default function WholesaleButton({
  productId,
  productName,
  locale = 'nl',
}: WholesaleButtonProps) {
  // Get button text based on locale
  const getButtonText = () => {
    if (locale === 'en') return 'Wholesale (1000+ seeds)';
    if (locale === 'nl') return 'Groothandel (1000+ zaden)';
    if (locale === 'de') return 'Großhandel (1000+ Samen)';
    if (locale === 'fr') return 'Vente en gros (1000+ graines)';
    return 'Groothandel (1000+ zaden)'; // Default to Dutch
  };

  return (
    <Link
      href={`/wholesale?product=${productId}&name=${encodeURIComponent(productName)}`}
      className="block w-full mt-4 px-6 py-3 rounded-md font-medium text-center text-white bg-green-600 hover:bg-green-700 transition-colors"
    >
      {getButtonText()}
    </Link>
  );
}
