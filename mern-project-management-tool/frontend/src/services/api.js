import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

export const projectAPI = {
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post("/projects", projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  addMember: (id, memberData) =>
    api.post(`/projects/${id}/members`, memberData),
};

export const taskAPI = {
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  create: (taskData) => api.post("/tasks", taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  updatePosition: (id, positionData) =>
    api.put(`/tasks/${id}/position`, positionData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const timeLogAPI = {
  start: (data) => api.post("/time-logs/start", data),
  stop: () => api.post("/time-logs/stop"),
  getMyLogs: () => api.get("/time-logs/my-logs"),
  getByProject: (projectId) => api.get(`/time-logs/project/${projectId}`),
};

export const fileAPI = {
  upload: (formData) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getByProject: (projectId) => api.get(`/files/project/${projectId}`),
  delete: (id) => api.delete(`/files/${id}`),
};

export const analyticsAPI = {
  getProjectAnalytics: (projectId) =>
    api.get(`/analytics/project/${projectId}`),
};

export default api;
