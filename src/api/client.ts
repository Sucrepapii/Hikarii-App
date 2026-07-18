import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { supabase } from "../supabase/client";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? "https://hikarii.onrender.com/api" 
    : "http://127.0.0.1:5005/api");

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("SignOut error in interceptor:", e);
      }
      localStorage.removeItem("auth-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
