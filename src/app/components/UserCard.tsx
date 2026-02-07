'use client';

interface UserCardProps {
  user: {
    id: string;
    email: string;
    display_name: string;
    profile_picture: string;
    role: string;
    is_active: boolean;
    created_at: string;
  };
  onUpdate: (userId: string, data: { role?: string; is_active?: boolean }) => void;
}

export default function UserCard({ user, onUpdate }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center space-x-4">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={user.display_name}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-lg">
              {user.display_name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.display_name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Role:</label>
            <select
              value={user.role}
              onChange={(e) => onUpdate(user.id, { role: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Active:</label>
            <input
              type="checkbox"
              checked={user.is_active}
              onChange={(e) => onUpdate(user.id, { is_active: e.target.checked })}
              className="rounded"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Joined: {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}