'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

export type PackageSize = {
  id: string;
  size: number;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  available: boolean;
};

type PackageSizeSelectorProps = {
  packageSizes: PackageSize[];
  onSelect: (packageSize: PackageSize) => void;
  selectedId?: string;
  locale?: string;
};

export default function PackageSizeSelector({
  packageSizes,
  onSelect,
  selectedId,
  locale = 'nl',
}: PackageSizeSelectorProps) {
  const [selected, setSelected] = useState<PackageSize | null>(
    packageSizes.find(pkg => pkg.id === selectedId) || packageSizes[0] || null
  );

  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale === 'nl' ? 'nl-NL' : locale === 'de' ? 'de-DE' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get seed text based on locale
  const getSeedText = (count: number) => {
    if (locale === 'en') return count === 1 ? 'seed' : 'seeds';
    if (locale === 'nl') return count === 1 ? 'zaad' : 'zaden';
    if (locale === 'de') return count === 1 ? 'Samen' : 'Samen';
    if (locale === 'fr') return count === 1 ? 'graine' : 'graines';
    return count === 1 ? 'zaad' : 'zaden'; // Default to Dutch
  };

  const handleChange = (packageSize: PackageSize) => {
    setSelected(packageSize);
    onSelect(packageSize);
  };

  if (!packageSizes.length) return null;

  return (
    <div className="w-full mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        {locale === 'en' ? 'Package Size' : 
         locale === 'nl' ? 'Pakketgrootte' : 
         locale === 'de' ? 'Paketgröße' : 
         'Taille du paquet'}
      </h3>
      
      <RadioGroup value={selected} onChange={handleChange} className="space-y-2">
        {packageSizes.map((pkg) => (
          <RadioGroup.Option
            key={pkg.id}
            value={pkg}
            disabled={!pkg.available || pkg.stock_quantity <= 0}
            className={({ active, checked, disabled }: { active: boolean, checked: boolean, disabled: boolean }) => `
              ${checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}
              ${active ? 'ring-2 ring-blue-200' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              relative rounded-lg border p-4 flex items-center justify-between transition-all
            `}
          >
            {({ checked }: { checked: boolean }) => (
              <>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                    {checked && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <RadioGroup.Label as="p" className={`ml-3 font-medium ${checked ? 'text-blue-900' : 'text-gray-800'}`}>
                    {pkg.size} {getSeedText(pkg.size)}
                  </RadioGroup.Label>
                </div>
                <div className="text-right">
                  {pkg.sale_price ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-green-600">
                        {formatPrice(pkg.sale_price)}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(pkg.price)}
                    </span>
                  )}
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
