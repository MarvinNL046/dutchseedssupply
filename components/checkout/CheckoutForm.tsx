'use client';

import { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import { useCart } from '@/components/cart/CartContext';
import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

interface CheckoutFormProps {
  domainId: string;
}

export default function CheckoutForm({ domainId }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useClientTranslations(translations);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Naam is verplicht';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail is ongeldig';
    }
    if (!formData.address.trim()) newErrors.address = 'Adres is verplicht';
    if (!formData.city.trim()) newErrors.city = 'Stad is verplicht';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postcode is verplicht';
    if (!formData.country.trim()) newErrors.country = 'Land is verplicht';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!selectedMethodId) {
      setErrors((prev) => ({ ...prev, paymentMethod: 'Selecteer een betaalmethode' }));
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order items from cart
      const orderItems = items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create payment
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          orderItems,
          customer: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          preferredMethodId: selectedMethodId
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment');
      }
      
      // Clear cart before redirecting
      clearCart();
      
      // Redirect to Viva checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      setErrors((prev) => ({ 
        ...prev, 
        submit: 'Er is een fout opgetreden bij het verwerken van je betaling. Probeer het later opnieuw.' 
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('customerDetails') || 'Klantgegevens'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerName') || 'Naam'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerEmail') || 'E-mail'}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerAddress') || 'Adres'}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerCity') || 'Stad'}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerPostalCode') || 'Postcode'}
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customerCountry') || 'Land'}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full rounded-md border ${
                errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('paymentMethod') || 'Betaling'}</h2>
        
        <div className="mb-6">
          <PaymentMethodSelector 
            domainId={domainId} 
            onMethodSelect={setSelectedMethodId} 
          />
          {errors.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>{t('total') || 'Totaal'}:</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? t('processing') || 'Bezig met verwerken...' : t('pay') || 'Betalen'}
      </button>
    </form>
  );
}
