'use client';

import { useState, useEffect } from 'react';
import { getPaymentMethodsForDomain } from '@/lib/payment/viva';
import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

interface PaymentMethodSelectorProps {
  domainId: string;
  onMethodSelect: (methodId: number) => void;
}

export default function PaymentMethodSelector({ 
  domainId,
  onMethodSelect
}: PaymentMethodSelectorProps) {
  const { t } = useClientTranslations(translations);
  const methods = getPaymentMethodsForDomain(domainId);
  const [selectedMethod, setSelectedMethod] = useState<number>(methods[0]?.id || 0);
  
  useEffect(() => {
    onMethodSelect(selectedMethod);
  }, [selectedMethod, onMethodSelect]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('paymentMethod') || 'Betaalmethode'}</h3>
      
      <div className="space-y-2">
        {methods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`method-${method.id}`}
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`method-${method.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {method.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
