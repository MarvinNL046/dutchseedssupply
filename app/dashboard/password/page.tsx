'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate passwords
    if (newPassword.length < 8) {
      setErrorMessage('Je nieuwe wachtwoord moet minimaal 8 tekens bevatten.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('De wachtwoorden komen niet overeen.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the current user's email
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        setErrorMessage('Je bent niet ingelogd. Log opnieuw in en probeer het nogmaals.');
        setIsLoading(false);
        return;
      }
      
      // First, sign in with the current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        console.error('Error verifying current password:', signInError);
        setErrorMessage('Het huidige wachtwoord is onjuist.');
        setIsLoading(false);
        return;
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        setErrorMessage('Er is een fout opgetreden bij het wijzigen van je wachtwoord.');
      } else {
        setSuccessMessage('Je wachtwoord is succesvol gewijzigd.');
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('Er is een onverwachte fout opgetreden.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wachtwoord Wijzigen</h1>
      
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
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Huidig Wachtwoord
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nieuw Wachtwoord
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Minimaal 8 tekens</p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bevestig Nieuw Wachtwoord
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Bezig met opslaan...' : 'Wachtwoord Wijzigen'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Wachtwoord Veiligheid</h2>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
          Een sterk wachtwoord is belangrijk voor de veiligheid van je account. Hier zijn enkele tips:
        </p>
        <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
          <li>Gebruik minimaal 8 tekens</li>
          <li>Combineer hoofdletters, kleine letters, cijfers en speciale tekens</li>
          <li>Vermijd voor de hand liggende woorden of persoonlijke informatie</li>
          <li>Gebruik voor elke website een uniek wachtwoord</li>
          <li>Overweeg het gebruik van een wachtwoordmanager</li>
        </ul>
      </div>
    </div>
  );
}
