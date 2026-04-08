import axios from "axios";

const apiAdmin = axios.create({
  baseURL: import.meta.env.BACKEND_URI,
});

apiAdmin.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default apiAdmin;