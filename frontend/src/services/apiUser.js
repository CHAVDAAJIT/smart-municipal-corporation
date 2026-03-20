import axios from "axios";

const apiUser = axios.create({
  baseURL: "http://localhost:5000/api"
});

apiUser.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createDocument = (formData, token) => {
  return fetch("/api/documents/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(res => res.json());
};

export const getDocuments = (token) => {
  return fetch("/api/documents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
};
export default apiUser;