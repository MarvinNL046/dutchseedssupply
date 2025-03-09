'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Profile {
  id: string;
  email: string;
  role: string;
  loyalty_points: number;
  created_at: string;
}

interface Order {
  id: string;
  order_code: string;
  status: string;
  amount: string;
  created_at: string;
  user_id: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    async function loadData() {
      try {
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
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
          } else {
            // Get recent orders
            const { data: ordersData, error: ordersError } = await supabase
              .from('orders')
              .select('*')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false })
              .limit(5);
            
            if (ordersError) {
              console.error('Error fetching orders:', ordersError);
            } else {
              setOrders(ordersData || []);
            }
          }
        } catch (error) {
          console.error('Error checking orders table:', error);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Profile Summary */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Mijn Profiel</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {profile?.email}</p>
            <p><span className="font-medium">Loyalty Punten:</span> {profile?.loyalty_points || 0}</p>
            <p><span className="font-medium">Account aangemaakt:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Onbekend'}</p>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/profile" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Profiel bewerken →
            </Link>
          </div>
        </div>
        
        {/* Loyalty Points */}
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Loyalty Punten</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {profile?.loyalty_points || 0}
            </div>
          </div>
          <p className="text-sm text-center mb-4">
            Spaar punten bij elke aankoop en wissel ze in voor kortingen op toekomstige bestellingen.
          </p>
          <div className="text-center">
            <Link 
              href="/dashboard/loyalty" 
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
            >
              Meer informatie →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Recente Bestellingen</h2>
        </div>
        
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <p className="font-medium">Bestelling #{order.order_code}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
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
                    <span className="ml-2 text-sm font-medium">
                      €{parseFloat(order.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>Je hebt nog geen bestellingen geplaatst.</p>
            <Link 
              href="/products" 
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Bekijk onze producten
            </Link>
          </div>
        )}
        
        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <Link 
              href="/dashboard/orders" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Alle bestellingen bekijken →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
