import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URI || "http://localhost:5000/api";

const apiUser = axios.create({ baseURL: BASE_URL });

apiUser.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ Auto refresh on 401
apiUser.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 &&
        error.response?.data?.tokenExpired &&
        !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("userToken");
        window.location.href = "/user/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem("userToken", res.data.token);
        original.headers.Authorization = `Bearer ${res.data.token}`;
        return apiUser(original);
      } catch (err) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/user/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const createDocument = (formData, token) => {
  return fetch(`${BASE_URL}/documents/request`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  });
};

export const getDocuments = (token) => {
  return fetch(`${BASE_URL}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
};

export default apiUser;