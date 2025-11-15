import React, { createContext, useState, useContext } from "react";
import { projectAPI } from "../services/api";

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await projectAPI.create(projectData);
      setProjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const fetchProject = async (id) => {
    setLoading(true);
    try {
      const response = await projectAPI.getById(id);
      setCurrentProject(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await projectAPI.update(id, projectData);
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      );
      if (currentProject && currentProject._id === id) {
        setCurrentProject(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const addMember = async (projectId, memberData) => {
    try {
      const response = await projectAPI.addMember(projectId, memberData);
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? response.data : p))
      );
      if (currentProject && currentProject._id === projectId) {
        setCurrentProject(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const value = {
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    fetchProject,
    updateProject,
    addMember,
    setCurrentProject,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
