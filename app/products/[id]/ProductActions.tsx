'use client';

import { useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import PackageSizeSelector, { PackageSize } from '@/components/products/PackageSizeSelector';
import WholesaleButton from '@/components/products/WholesaleButton';

type Product = {
  id: number;
  name: string;
  description: string;
};

type ProductVariant = {
  id: string;
  product_id: string;
  domain_id: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: string;
  available: boolean;
  package_size?: number; // Added package_size field
};

type ProductActionsProps = {
  product: Product;
  variants: ProductVariant[];
  buttonText: string;
  locale?: string;
};

export default function ProductActions({
  product,
  variants,
  buttonText,
  locale = 'nl',
}: ProductActionsProps) {
  // Convert variants to package sizes
  const packageSizes: PackageSize[] = variants.map(variant => ({
    id: variant.id,
    size: variant.package_size || 0, // Default to 0 if not specified
    price: variant.price,
    sale_price: variant.sale_price,
    stock_quantity: variant.stock_quantity,
    available: variant.available !== false,
  }));

  // Set the first package size as the default selected
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Handle package size selection
  const handlePackageSizeSelect = (packageSize: PackageSize) => {
    const variant = variants.find(v => v.id === packageSize.id);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  if (!selectedVariant) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
        <p className="text-yellow-700">
          {locale === 'en' ? 'No variants available for this product.' : 
           locale === 'nl' ? 'Geen varianten beschikbaar voor dit product.' : 
           locale === 'de' ? 'Keine Varianten für dieses Produkt verfügbar.' : 
           'Aucune variante disponible pour ce produit.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {/* Package Size Selector */}
        {packageSizes.length > 0 && (
          <PackageSizeSelector
            packageSizes={packageSizes}
            onSelect={handlePackageSizeSelect}
            selectedId={selectedVariant.id}
            locale={locale}
          />
        )}

        {/* Add to Cart Button */}
        {selectedVariant.stock_quantity > 0 ? (
          <AddToCartButton
            product={product}
            variant={selectedVariant}
            buttonText={buttonText}
          />
        ) : (
          <button
            disabled
            className="w-full px-6 py-3 rounded-md font-medium text-white bg-gray-400 cursor-not-allowed"
          >
            {locale === 'en' ? 'Out of Stock' : 
             locale === 'nl' ? 'Niet op voorraad' : 
             locale === 'de' ? 'Nicht auf Lager' : 
             'Rupture de stock'}
          </button>
        )}

        {/* Wholesale Button */}
        <WholesaleButton
          productId={product.id}
          productName={product.name}
          locale={locale}
        />
    </div>
  );
}
