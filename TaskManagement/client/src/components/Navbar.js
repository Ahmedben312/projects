import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";

const Navbar = ({ onLogout, username }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">✓</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">TaskFlow</h1>
              <p className="text-blue-100 text-sm">Welcome, {username}!</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <AddTaskModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
