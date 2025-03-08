import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import Link from 'next/link';
import CartContents from './CartContents';

export default async function CartPage() {
  // Get translations
  const { t } = await getTranslations(translations);
  
  // Prepare translated texts for the client component
  const translatedTexts = {
    emptyCart: t('emptyCart') || 'Je winkelwagen is leeg.',
    startShopping: t('startShopping') || 'Begin met winkelen',
    product: t('product') || 'Product',
    price: t('price') || 'Prijs',
    quantity: t('quantity') || 'Aantal',
    total: t('total') || 'Totaal',
    actions: t('actions') || 'Acties',
    totalItems: t('totalItems') || 'Totaal aantal items',
    subtotal: t('subtotal') || 'Subtotaal',
    proceedToCheckout: t('proceedToCheckout') || 'Naar afrekenen',
    remove: t('remove') || 'Verwijderen',
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart') || 'Winkelwagen'}</h1>
      
      <div className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← {t('continueShopping') || 'Verder winkelen'}
        </Link>
      </div>
      
      <CartContents translatedTexts={translatedTexts} />
    </div>
  );
}
