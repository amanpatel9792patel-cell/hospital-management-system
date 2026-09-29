import api from "./api.js";
export const getDoctors = () => api.get("/doctors");
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const addDoctor = (data) => api.post("/doctors", data);
export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
