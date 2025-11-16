import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/common/Header";
import Home from "./pages/common/Home";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import Courses from "./pages/common/Courses"; // Add this import
import CourseDetails from "./pages/common/CourseDetails";
import Profile from "./pages/common/Profile"; // Add this import
import MyCertificates from "./pages/common/MyCertificates"; // Add this import
import StudentDashboard from "./pages/student/Dashboard";
import CoursePlayer from "./pages/student/CoursePlayer";
import EducatorDashboard from "./pages/educator/Dashboard";
import MyCourses from "./pages/educator/MyCourses";
import MyEnrollments from "./pages/student/MyEnrollments";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />{" "}
            {/* Add this route */}
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />{" "}
            {/* Add profile route */}
            <Route
              path="/my-certificates"
              element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />{" "}
            {/* Add certificates route */}
            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute>
                  <MyEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />
            {/* Educator Routes */}
            <Route
              path="/educator/dashboard"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <EducatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/educator/courses"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <MyCourses />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
