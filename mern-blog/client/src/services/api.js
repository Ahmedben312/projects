import axios from "axios";
import { getToken, removeToken, removeUser } from "../utils/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (userData) => API.post("/auth/register", userData),
  getProfile: () => API.get("/auth/profile"),
};

// Posts API
export const postsAPI = {
  getPosts: (page = 1, limit = 10) =>
    API.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (id) => API.get(`/posts/${id}`),
  createPost: (postData) => API.post("/posts", postData),
  likePost: (id) => API.post(`/posts/${id}/like`),
  addComment: (id, comment) =>
    API.post(`/posts/${id}/comment`, { text: comment }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default API;
