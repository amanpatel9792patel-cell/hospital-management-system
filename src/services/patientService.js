import api from "./api.js";
export const getPatients = () => api.get("/patients");
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const addPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);
