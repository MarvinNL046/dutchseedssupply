import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welkom bij Dutch Seed Supply!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Je account is succesvol geactiveerd.
          </p>
        </div>
        
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="text-sm text-green-700">
            Je kunt nu inloggen en gebruik maken van alle functies van onze website.
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Inloggen
          </Link>
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
