import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import axios from "axios";

const Dashboard = () => {
  const { projects, fetchProjects, createProject } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setShowCreateModal(false);
      setNewProject({ name: "", description: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {project.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === "active"
                    ? "bg-green-100 text-green-800"
                    : project.status === "completed"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {project.description}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Members: {project.members.length + 1}</span>
              <span>
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newProject.startDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newProject.endDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
