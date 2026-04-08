import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiAdmin = axios.create({
  baseURL: BASE_URL
});

apiAdmin.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default apiAdmin;



// import axios from "axios";

// const apiAdmin = axios.create({
//   baseURL: import.meta.env.BACKEND_URI,
// });

// apiAdmin.interceptors.request.use((req) => {
//   const token = localStorage.getItem("adminToken");

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// export default apiAdmin;