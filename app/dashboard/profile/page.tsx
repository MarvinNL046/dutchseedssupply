'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/ui/toast';

interface Profile {
  id: string;
  email: string;
  role: string;
  loyalty_points: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        // Check if user is authenticated using AuthContext
        if (!isAuthenticated && !authLoading) {
          addToast('Je moet ingelogd zijn om je profiel te bekijken', 'info');
          router.push('/login');
          return;
        }
        
        // Wait for auth to finish loading
        if (authLoading) {
          return;
        }
        
        // Use the user from AuthContext
        if (!user?.id) {
          addToast('Gebruiker niet gevonden', 'error');
          router.push('/login');
          return;
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          const errorMsg = 'Er is een fout opgetreden bij het laden van je profiel.';
          setErrorMessage(errorMsg);
          addToast(errorMsg, 'error');
        } else {
          setProfile(profileData);
          
          // Initialize form data with profile data
          setFormData({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            address: profileData.address || '',
            city: profileData.city || '',
            postal_code: profileData.postal_code || '',
            country: profileData.country || '',
            phone: profileData.phone || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        const errorMsg = 'Er is een fout opgetreden bij het laden van je profiel.';
        setErrorMessage(errorMsg);
        addToast(errorMsg, 'error');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [supabase, router, user, isAuthenticated, authLoading, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Check if user is authenticated using AuthContext
      if (!isAuthenticated) {
        const errorMsg = 'Je moet ingelogd zijn om je profiel op te slaan';
        addToast(errorMsg, 'error');
        router.push('/login');
        return;
      }
      
      // Use the user from AuthContext
      if (!user?.id) {
        const errorMsg = 'Gebruiker niet gevonden';
        addToast(errorMsg, 'error');
        router.push('/login');
        return;
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        const errorMsg = 'Er is een fout opgetreden bij het opslaan van je profiel.';
        setErrorMessage(errorMsg);
        addToast(errorMsg, 'error');
      } else {
        const successMsg = 'Je profiel is succesvol bijgewerkt.';
        setSuccessMessage(successMsg);
        addToast(successMsg, 'success');
        
        // Update local profile state
        setProfile(prev => prev ? { ...prev, ...formData } : null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = 'Er is een fout opgetreden bij het opslaan van je profiel.';
      setErrorMessage(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profiel Bewerken</h1>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Persoonlijke Informatie</h2>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">E-mailadres kan niet worden gewijzigd</p>
            </div>
            
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Voornaam
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Achternaam
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefoonnummer
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Address Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Adresgegevens</h2>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adres
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Postcode
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plaats
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Land
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Bezig met opslaan...' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
