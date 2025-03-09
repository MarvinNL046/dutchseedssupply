'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

interface Order {
  id: string;
  order_code: string;
  status: string;
  amount: string;
  created_at: string;
  user_id: string;
  items: Record<string, unknown>;
  customer_name?: string;
  customer_email?: string;
  customer_address?: string;
  customer_city?: string;
  customer_postal_code?: string;
  customer_country?: string;
  payment_method?: string;
  transaction_date?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadOrders() {
      try {
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setError('Je moet ingelogd zijn om je bestellingen te bekijken.');
          setIsLoading(false);
          return;
        }
        
        try {
          // Check if orders table exists
          const { error: tableError } = await supabase
            .from('orders')
            .select('count')
            .limit(1);
          
          if (tableError && tableError.code === '42P01') {
            // Table doesn't exist, set empty orders and don't show error
            console.log('Orders table does not exist yet. This is normal if no orders have been placed.');
            setOrders([]);
            setIsLoading(false);
            return;
          }
          
          // Get orders
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          
          if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            setError('Er is een fout opgetreden bij het ophalen van je bestellingen.');
          } else {
            setOrders(ordersData || []);
          }
        } catch (error) {
          console.error('Error loading orders:', error);
          setError('Er is een fout opgetreden bij het ophalen van je bestellingen.');
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Er is een fout opgetreden bij het ophalen van je bestellingen.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadOrders();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mijn Bestellingen</h1>
      
      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p>Je hebt nog geen bestellingen geplaatst.</p>
          <Link 
            href="/products" 
            className="mt-2 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Bekijk onze producten
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bestelnummer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Datum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bedrag
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Betaalmethode
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.order_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {order.status === 'completed' ? 'Voltooid' : 
                         order.status === 'pending' ? 'In behandeling' : 
                         order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        €{parseFloat(order.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.payment_method || 'Onbekend'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Bestelgegevens</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Heb je vragen over je bestelling? Neem dan contact op met onze klantenservice via{' '}
          <a href="mailto:info@dutchseedsupply.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            info@dutchseedsupply.com
          </a>
        </p>
      </div>
    </div>
  );
}
