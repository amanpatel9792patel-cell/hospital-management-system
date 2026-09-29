import api from "./api.js";

export const getAppointments = () => api.get("/appointments");

export const getAppointmentById = (id) =>
    api.get(`/appointments/${id}`);

export const addAppointment = (data) => {
    const { patientId, doctorId, ...appointmentData } = data;

    return api.post("/appointments", appointmentData, {
        params: {
            patientId,
            doctorId,
        },
    });
};

export const updateAppointment = (id, data) => {
    const { patientId, doctorId, ...appointmentData } = data;

    return api.put(`/appointments/${id}`, appointmentData, {
        params: {
            patientId,
            doctorId,
        },
    });
};

export const deleteAppointment = (id) =>
    api.delete(`/appointments/${id}`);