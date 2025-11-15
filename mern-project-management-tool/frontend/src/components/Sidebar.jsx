import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.path
                ? "bg-primary-50 border-r-4 border-primary-500"
                : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
