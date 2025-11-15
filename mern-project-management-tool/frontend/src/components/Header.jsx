import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Manager</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
