// import { redirect } from 'next/navigation'; // Uncomment if login is required
import { createServerSupabaseClient, getDomainId } from '@/lib/supabase';
import { getTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  // Get the current domain ID
  const domainId = await getDomainId();
  
  // Get translations
  const { t } = await getTranslations(translations);
  
  // Create Supabase client
  const supabase = await createServerSupabaseClient();
  
  // Check if user is logged in (optional)
  // This is currently not used but kept for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: { session } } = await supabase.auth.getSession();
  
  // For future implementation: require login for checkout
  // if (!session) {
  //   redirect('/login?redirect=/checkout');
  // }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout') || 'Afrekenen'}</h1>
      
      <div className="max-w-3xl mx-auto">
        <CheckoutForm domainId={domainId} />
      </div>
    </div>
  );
}
