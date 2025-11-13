import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskProvider } from "./Context/TaskContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import TaskList from "./components/TaskList";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentView, setCurrentView] = useState("login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TaskProvider>
        <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {loggedInUser ? (
            <div className="min-h-screen">
              <Navbar onLogout={handleLogout} username={loggedInUser} />
              <div className="container mx-auto px-4 py-8">
                <TaskList />
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    TaskFlow
                  </h1>
                  <p className="text-gray-600">Manage your tasks efficiently</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex justify-center space-x-4 mb-6">
                    <button
                      onClick={() => setCurrentView("login")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        currentView === "login"
                          ? "bg-blue-500 text-white shadow-lg transform -translate-y-1"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setCurrentView("register")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        currentView === "register"
                          ? "bg-green-500 text-white shadow-lg transform -translate-y-1"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  {currentView === "login" ? (
                    <Login setLoggedInUser={setLoggedInUser} />
                  ) : (
                    <Register setCurrentView={setCurrentView} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </TaskProvider>
    </DndProvider>
  );
}

export default App;
