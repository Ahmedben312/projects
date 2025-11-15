import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import KanbanBoard from "../components/KanbanBoard";
import TimeTracker from "../components/TimeTracker";

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentProject, fetchProject, loading } = useProject();
  const [activeTab, setActiveTab] = useState("kanban");

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentProject.name}
        </h1>
        <p className="text-gray-600 mt-2">{currentProject.description}</p>
        <div className="flex items-center mt-4 space-x-4 text-sm text-gray-500">
          <span>Owner: {currentProject.owner?.name}</span>
          <span>Members: {currentProject.members.length + 1}</span>
          <span>
            Status:{" "}
            <span
              className={`capitalize ${
                currentProject.status === "active"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {currentProject.status}
            </span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["kanban", "time-tracker", "files", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "kanban" && <KanbanBoard projectId={id} />}
        {activeTab === "time-tracker" && <TimeTracker projectId={id} />}
        {activeTab === "files" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Files</h3>
            <p className="text-gray-500">
              File sharing functionality will be implemented here.
            </p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Project Settings</h3>
            <p className="text-gray-500">
              Project settings will be implemented here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
