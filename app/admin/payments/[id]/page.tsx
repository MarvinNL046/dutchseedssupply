import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';

// Define the correct type for the params
type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function AdminPaymentDetailsPage({
  params,
}: PageProps) {
  // Check admin rights
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Check if user is admin
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  
  // Get the ID from params
  const { id } = params;
  
  // Fetch order details
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !order) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">Bestelling niet gevonden</p>
        </div>
        <Link href="/admin/payments" className="text-blue-600 hover:underline">
          ← Terug naar betalingsbeheer
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/payments" className="text-blue-600 hover:underline">
          ← Terug naar betalingsbeheer
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Bestellingsdetails</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Bestellingsinformatie</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order Code:</span>
              <span className="font-medium">{order.order_code}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium ${
                order.status === 'paid' 
                  ? 'text-green-600' 
                  : order.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bedrag:</span>
              <span className="font-medium">€{order.amount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Aangemaakt op:</span>
              <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            
            {order.transaction_date && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Betaald op:</span>
                <span className="font-medium">{new Date(order.transaction_date).toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Domein:</span>
              <span className="font-medium">{order.domain_id}</span>
            </div>
            
            {order.payment_method && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Betaalmethode:</span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
            )}
            
            {order.payment_id && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transactie ID:</span>
                <span className="font-medium">{order.payment_id}</span>
              </div>
            )}
            
            {order.payment_provider_ref && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Viva.com Referentie:</span>
                <span className="font-medium">{order.payment_provider_ref}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Klantinformatie</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Naam:</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">E-mail:</span>
              <span className="font-medium">{order.customer_email}</span>
            </div>
            
            {/* Additional customer information if available */}
            {order.customer_address && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Adres:</span>
                <span className="font-medium">{order.customer_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Bestelde items</h2>
        
        {order.items && order.items.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prijs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aantal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotaal</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item: { 
                name: string; 
                price: number; 
                quantity: number;
                product_id?: number;
                variant_id?: number;
              }, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">€{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">€{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Geen items gevonden</p>
        )}
      </div>
      
      {order.status === 'paid' && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Terugbetaling</h2>
          <p className="mb-4">
            Terugbetalingen kunnen niet automatisch worden verwerkt. Klanten moeten contact opnemen voor terugbetalingsverzoeken.
          </p>
          <p>
            Voor het verwerken van een terugbetaling, neem contact op met Viva.com support en vermeld het transactie-ID: <strong>{order.payment_id || 'Niet beschikbaar'}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
