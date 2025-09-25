import axios from "axios";
import { authHeaders } from "../../api"; // existing helper

// Backend API base URL
const BASE_URL = "https://bloging-platform.onrender.com";

//  Axios instance with auth header support
export function adminAxios(token) {
  const instance = axios.create({ baseURL: BASE_URL });
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        ...authHeaders(token),
      };
    }
    return config;
  });
  return instance;
}

// Admin endpoints
export const endpoints = {
  // Users
  users: "/api/admin/users",
  userById: (id) => `/api/admin/users/${id}`,

  // Blogs
  blogs: "/api/admin/blogs",
  blogById: (id) => `/api/admin/blogs/${id}`,
};
