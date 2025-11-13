import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async (title, description, status, dueDate) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/tasks`,
        { title, description, status, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const value = {
    tasks,
    addTask,
    updateTaskStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
