import React, { useState, useEffect } from "react";
import { User } from "../types";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import UserList from "../components/users/UserList";
import UserForm from "../components/users/UserForm";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import { Plus } from "lucide-react";

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    role: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const canManage = currentUser?.role === "admin";

  useEffect(() => {
    loadUsers();
  }, [filters, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const where: any = {};
      if (filters.role) where.role = filters.role;
      if (searchTerm) {
        where.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { membershipId: { $regex: searchTerm, $options: "i" } },
        ];
      }

      const response = await userService.getUsers({
        page: filters.page,
        limit: filters.limit,
        where: JSON.stringify(where),
      });

      setUsers(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser._id, userData);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(userId);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await userService.changeUserRole(userId, role);
      loadUsers();
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Error changing user role");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  if (!canManage) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Access Denied</div>
        <p className="text-gray-400 mt-2">
          You don't have permission to view this page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage library users and permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search users by name, email, or membership ID..."
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    role: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="member">Member</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : (
            <>
              <UserList
                users={users}
                onEdit={handleEdit}
                onDelete={handleDeleteUser}
                onChangeRole={handleChangeRole}
                currentUserRole={currentUser?.role || "admin"}
              />

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={filters.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {(showForm || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm
              user={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
              currentUserRole={currentUser?.role || "admin"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
