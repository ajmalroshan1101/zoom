'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user?: {
    display_name: string;
    profile_picture: string;
    role: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Zoom App
            </Link>
            {user && (
              <div className="flex space-x-4">
                <Link href="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-200">
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.profile_picture && (
                  <img
                    src={user.profile_picture}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{user.display_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}