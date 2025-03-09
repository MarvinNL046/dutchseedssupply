'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Profile {
  id: string;
  email: string;
  role: string;
  loyalty_points: number;
  created_at: string;
}

export default function LoyaltyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setError('Je moet ingelogd zijn om je loyalty punten te bekijken.');
          setIsLoading(false);
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
          setError('Er is een fout opgetreden bij het ophalen van je profiel.');
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Er is een fout opgetreden bij het ophalen van je profiel.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
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
      <h1 className="text-2xl font-bold mb-6">Loyalty Punten</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-green-500 p-8 text-center">
          <h2 className="text-white text-lg font-semibold mb-2">Jouw Loyalty Punten</h2>
          <div className="text-5xl font-bold text-white">{profile?.loyalty_points || 0}</div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bij elke aankoop spaar je automatisch loyalty punten. Deze punten kun je gebruiken voor kortingen op toekomstige bestellingen.
          </p>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Hoe werkt het?</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Voor elke €10 die je besteedt, ontvang je 1 loyalty punt.
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                10 loyalty punten = €5 korting op je volgende bestelling.
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                25 loyalty punten = €15 korting op je volgende bestelling.
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                50 loyalty punten = €35 korting op je volgende bestelling.
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Hoe gebruik je je punten?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Tijdens het afrekenen kun je ervoor kiezen om je loyalty punten in te wisselen voor korting. De beschikbare kortingen worden automatisch getoond op basis van je puntensaldo.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            <span className="font-medium">Let op:</span> Loyalty punten zijn 1 jaar geldig vanaf het moment dat je ze hebt verdiend.
          </p>
        </div>
      </div>
    </div>
  );
}
