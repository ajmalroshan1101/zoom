import { redirect } from 'next/navigation';
import { getSession } from '@/src/lib/auth';
import ZoomLoginButton from '@/src/app/components/ZoomLoginButton';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getSession();
  
  if (user) {
    redirect('/dashboard');
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign In
          </h1>
          <p className="text-gray-600">
            Connect your Zoom account to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error === 'access_denied' 
              ? 'Access was denied. Please try again.'
              : error === 'auth_failed'
              ? 'Authentication failed. Please try again.'
              : 'An error occurred. Please try again.'}
          </div>
        )}

        <div className="flex justify-center">
          <ZoomLoginButton />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}