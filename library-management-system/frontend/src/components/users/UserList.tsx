import React from 'react';
import { User } from '../../types';
import { Mail, Phone, MapPin, Book, Crown, User as UserIcon, Shield } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onChangeRole?: (userId: string, role: string) => void;
  currentUserRole: string;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onChangeRole,
  currentUserRole 
}) => {
  const canManage = currentUserRole === 'admin';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'librarian': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <UserIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'librarian': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No users found</div>
        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div key={user._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(user.role)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              {canManage && (
                <div className="flex space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit user"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{user.address}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Book className="h-4 w-4 mr-2" />
                {user.borrowedBooks.length} books borrowed
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Membership ID: {user.membershipId}
            </div>

            {canManage && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                  {onChangeRole && user.role !== 'admin' && (
                    <select
                      value={user.role}
                      onChange={(e) => onChangeRole(user._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="librarian">Librarian</option>
                    </select>
                  )}
                </div>
                {onDelete && user.role !== 'admin' && (
                  <button
                    onClick={() => onDelete(user._id)}
                    className="text-red-600 hover:text-red-800 text-sm transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
