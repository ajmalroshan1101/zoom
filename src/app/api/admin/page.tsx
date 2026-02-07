'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/app/components/Navbar';
import UserCard from '@/src/app/components/UserCard';

interface User {
  id: string;
  email: string;
  display_name: string;
  profile_picture: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        if (data.role !== 'admin') {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else if (res.status === 403) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    userId: string,
    data: { role?: string; is_active?: boolean }
  ) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && <Navbar user={currentUser} />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage users and permissions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.filter(u => u.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Regular Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">All Users</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onUpdate={handleUpdateUser}
              />
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}