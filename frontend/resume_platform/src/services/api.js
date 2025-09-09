import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function signup(data) {
  return API.post("/auth/signup", data).then((r) => r.data);
}
export async function login(data) {
  return API.post("/auth/login", data).then((r) => r.data);
}
export async function me() {
  return API.get("/auth/me").then((r) => r.data);
}

export async function createResume(data) {
  return API.post("/resume", data).then((r) => r.data);
}
export async function getResumes() {
  return API.get("/resume").then((r) => r.data);
}
export async function updateResume(id, data) {
  return API.put(`/resume/${id}`, data).then((r) => r.data);
}
export async function deleteResume(id) {
  return API.delete(`/resume/${id}`).then((r) => r.data);
}
export async function downloadPDF(id) {
  return API.get(`/resume/pdf/${id}`, { responseType: "blob" }).then(
    (r) => r.data
  );
}
export async function getPublic(slug) {
  return API.get(`/resume/public/${slug}`).then((r) => r.data);
}
