const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.setToken(null);
        window.location.href = "/login";
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async get(url) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async post(url, data) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(url, data) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(url) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
