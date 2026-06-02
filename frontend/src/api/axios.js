import axios from "axios";

const api = axios.create({
    // baseURL: "https://task-manager-backend-4i6k.onrender.com/",
    baseURL:"http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;