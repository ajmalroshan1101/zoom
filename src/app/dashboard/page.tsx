import { redirect } from 'next/navigation';
import { getSession } from '@/src/lib/auth';
import Navbar from '@/src/app/components/Navbar';

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.display_name}!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6 col-span-full md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
            <div className="flex items-center space-x-4">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.display_name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.display_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{user.display_name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Account Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom Connected</span>
                <span className="text-green-600 font-medium">✓ Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Meetings
              </button>
              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Account Settings
              </button>
              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Refresh Zoom Data
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Zoom Integration</h2>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Successfully Connected!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your Zoom account is connected. You can now access your meetings and other Zoom features through this dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}