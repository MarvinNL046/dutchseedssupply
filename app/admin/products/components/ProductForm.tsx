'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ProductTranslation = {
  id?: string;
  product_id?: string;
  language_code: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
};

type ProductVariant = {
  id?: string;
  product_id?: string;
  domain_id: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status?: string;
  available: boolean;
};

type ProductImage = {
  url: string;
  alt?: string;
} | string;

type Product = {
  id?: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  stock_status: string;
  featured: boolean;
  images: ProductImage[];
};

type ProductFormProps = {
  product: Product | null;
  translations: ProductTranslation[];
  variants: ProductVariant[];
  availableDomains: string[];
  availableLanguages: string[];
  isNewProduct: boolean;
};

export default function ProductForm({
  product,
  translations,
  variants,
  availableDomains,
  availableLanguages,
  isNewProduct
}: ProductFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // State for product data
  const [productData, setProductData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price || 0,
    sale_price: product?.sale_price || null,
    stock_quantity: product?.stock_quantity || 0,
    stock_status: product?.stock_status || 'in_stock',
    featured: product?.featured || false,
    images: product?.images || [],
    // Add other product fields as needed
  });
  
  // State for translations
  const [translationData, setTranslationData] = useState<Record<string, ProductTranslation>>({});
  
  // State for variants
  const [variantData, setVariantData] = useState<Record<string, ProductVariant>>({});
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Initialize translations and variants
  useEffect(() => {
    // Initialize translations
    const translationsMap: Record<string, ProductTranslation> = {};
    
    // Add existing translations
    translations.forEach(translation => {
      translationsMap[translation.language_code] = translation;
    });
    
    // Add empty translations for missing languages
    availableLanguages.forEach(lang => {
      if (!translationsMap[lang]) {
        translationsMap[lang] = {
          language_code: lang,
          description: '',
          meta_title: '',
          meta_description: ''
        };
      }
    });
    
    setTranslationData(translationsMap);
    
    // Initialize variants
    const variantsMap: Record<string, ProductVariant> = {};
    
    // Add existing variants
    variants.forEach(variant => {
      variantsMap[variant.domain_id] = variant;
    });
    
    // Add empty variants for missing domains
    availableDomains.forEach(domain => {
      if (!variantsMap[domain]) {
        variantsMap[domain] = {
          domain_id: domain,
          price: productData.price,
          stock_quantity: productData.stock_quantity,
          stock_status: productData.stock_status,
          available: false
        };
      }
    });
    
    setVariantData(variantsMap);
  }, [translations, variants, availableDomains, availableLanguages, productData.price, productData.stock_quantity, productData.stock_status]);
  
  // Handle product data changes
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle translation changes
  const handleTranslationChange = (lang: string, field: string, value: string) => {
    setTranslationData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };
  
  // Handle variant changes
  const handleVariantChange = (domain: string, field: string, value: string | number | boolean) => {
    setVariantData(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [field]: field === 'price' || field === 'sale_price' || field === 'stock_quantity' 
          ? parseFloat(value as string) 
          : field === 'available' 
            ? value === 'true' || value === true
            : value
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      let productId = product?.id;
      
      // Generate slug if not provided
      if (!productData.slug) {
        productData.slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      if (isNewProduct) {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        
        if (productError) {
          throw new Error(`Error creating product: ${productError.message}`);
        }
        
        productId = newProduct.id;
      } else {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
        
        if (productError) {
          throw new Error(`Error updating product: ${productError.message}`);
        }
      }
      
      // Handle translations
      for (const lang of Object.keys(translationData)) {
        const translation = translationData[lang];
        
        if (translation.id) {
          // Update existing translation
          const { error: translationError } = await supabase
            .from('product_translations')
            .update({
              description: translation.description,
              meta_title: translation.meta_title,
              meta_description: translation.meta_description
            })
            .eq('id', translation.id);
          
          if (translationError) {
            console.error(`Error updating translation for ${lang}:`, translationError);
          }
        } else {
          // Create new translation
          const { error: translationError } = await supabase
            .from('product_translations')
            .insert({
              product_id: productId,
              language_code: lang,
              description: translation.description,
              meta_title: translation.meta_title,
              meta_description: translation.meta_description
            });
          
          if (translationError) {
            console.error(`Error creating translation for ${lang}:`, translationError);
          }
        }
      }
      
      // Handle variants
      for (const domain of Object.keys(variantData)) {
        const variant = variantData[domain];
        
        if (variant.id) {
          // Update existing variant
          const { error: variantError } = await supabase
            .from('product_variants')
            .update({
              price: variant.price,
              sale_price: variant.sale_price,
              stock_quantity: variant.stock_quantity,
              stock_status: variant.stock_status,
              available: variant.available
            })
            .eq('id', variant.id);
          
          if (variantError) {
            console.error(`Error updating variant for ${domain}:`, variantError);
          }
        } else {
          // Create new variant
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert({
              product_id: productId,
              domain_id: domain,
              price: variant.price,
              sale_price: variant.sale_price,
              stock_quantity: variant.stock_quantity,
              stock_status: variant.stock_status || 'in_stock',
              available: variant.available
            });
          
          if (variantError) {
            console.error(`Error creating variant for ${domain}:`, variantError);
          }
        }
      }
      
      setSuccess('Product successfully saved!');
      
      // Redirect to product list after a short delay
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error and success messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}
      
      {/* Product Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Product Informatie</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Naam
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={productData.slug}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="product-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              Laat leeg om automatisch te genereren op basis van de naam
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Basis Prijs (€)
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleProductChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Actieprijs (€)
            </label>
            <input
              type="number"
              name="sale_price"
              value={productData.sale_price || ''}
              onChange={handleProductChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Voorraad
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={productData.stock_quantity}
              onChange={handleProductChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Voorraadstatus
            </label>
            <select
              name="stock_status"
              value={productData.stock_status}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="in_stock">Op voorraad</option>
              <option value="out_of_stock">Niet op voorraad</option>
              <option value="on_backorder">Nabestelling</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={productData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Uitgelicht product
            </label>
          </div>
        </div>
      </div>
      
      {/* Translations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Vertalingen</h2>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="-mb-px flex space-x-4">
            {availableLanguages.map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  const tabs = document.querySelectorAll('[data-translation-tab]');
                  tabs.forEach(tab => {
                    if (tab.getAttribute('data-translation-tab') === lang) {
                      tab.classList.remove('hidden');
                    } else {
                      tab.classList.add('hidden');
                    }
                  });
                }}
                className={`py-2 px-4 text-sm font-medium ${
                  lang === 'nl' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
        
        {availableLanguages.map(lang => (
          <div 
            key={lang}
            data-translation-tab={lang}
            className={lang === 'nl' ? '' : 'hidden'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beschrijving ({lang.toUpperCase()})
                </label>
                <textarea
                  value={translationData[lang]?.description || ''}
                  onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Titel ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={translationData[lang]?.meta_title || ''}
                  onChange={(e) => handleTranslationChange(lang, 'meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Beschrijving ({lang.toUpperCase()})
                </label>
                <textarea
                  value={translationData[lang]?.meta_description || ''}
                  onChange={(e) => handleTranslationChange(lang, 'meta_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Domain-specific Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Domein-specifieke Varianten</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Domein</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prijs (€)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actieprijs (€)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Voorraad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beschikbaar</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {availableDomains.map(domain => (
                <tr key={domain}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    .{domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={variantData[domain]?.price || 0}
                      onChange={(e) => handleVariantChange(domain, 'price', e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={variantData[domain]?.sale_price || ''}
                      onChange={(e) => handleVariantChange(domain, 'sale_price', e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={variantData[domain]?.stock_quantity || 0}
                      onChange={(e) => handleVariantChange(domain, 'stock_quantity', e.target.value)}
                      min="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={variantData[domain]?.stock_status || 'in_stock'}
                      onChange={(e) => handleVariantChange(domain, 'stock_status', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="in_stock">Op voorraad</option>
                      <option value="out_of_stock">Niet op voorraad</option>
                      <option value="on_backorder">Nabestelling</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={variantData[domain]?.available ? 'true' : 'false'}
                      onChange={(e) => handleVariantChange(domain, 'available', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="true">Ja</option>
                      <option value="false">Nee</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-md font-medium text-white ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Opslaan...' : 'Product opslaan'}
        </button>
      </div>
    </form>
  );
}
