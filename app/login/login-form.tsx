'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Login attempt with email:', email);
      
      // Use the API route instead of direct Supabase client
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include cookies in the request
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        console.error('Login error:', data.error);
        const errorMessage = data.error || 'Er is een fout opgetreden bij het inloggen.';
        setError(errorMessage);
        addToast(errorMessage, 'error');
        setLoading(false);
        return;
      }
      
      // Show success toast
      addToast('Je bent succesvol ingelogd', 'success');

      console.log('Login successful, user:', data.user);
      console.log('Is admin:', data.isAdmin);
      console.log('Redirecting to:', data.redirectTo);
      
      // Let's check if we have a session cookie
      console.log('Cookies before redirect:', document.cookie);
      
      // Add a delay before redirecting to ensure cookies are set
      setTimeout(() => {
        console.log('Cookies after delay:', document.cookie);
        
        // Use window.location instead of router.push for a full page reload
        console.log('Redirecting to:', data.redirectTo);
        window.location.href = data.redirectTo;
      }, 1000); // Increased delay to 1 second
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = 'Er is een fout opgetreden bij het inloggen.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            E-mailadres
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Wachtwoord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Onthoud mij
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Wachtwoord vergeten?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Bezig met inloggen...' : 'Inloggen'}
        </button>
      </div>
    </form>
  );
}
