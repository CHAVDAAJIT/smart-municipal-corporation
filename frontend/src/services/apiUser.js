import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const apiUser = axios.create({
  baseURL: BASE_URL
});


apiUser.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createDocument = (formData, token) => {
  return fetch(`${BASE_URL}/documents/request`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => { 
        throw new Error(err.message || "Request failed") 
      });
    }
    return res.json();
  });
};

export const getDocuments = (token) => {
  return fetch(`${BASE_URL}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
};
export default apiUser;