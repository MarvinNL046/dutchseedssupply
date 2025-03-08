import { Suspense } from 'react';
import RegisterForm from './register-form';

// Fallback component voor tijdens het laden
function RegisterFormFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-blue-200 rounded"></div>
    </div>
  );
}

// Gebruik Suspense boundary voor useSearchParams()
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Maak een nieuw account aan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Of{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              log in op je bestaande account
            </a>
          </p>
        </div>
        <Suspense fallback={<RegisterFormFallback />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
