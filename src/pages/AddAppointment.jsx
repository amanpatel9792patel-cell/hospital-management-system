import { useEffect, useState } from "react";

import EntityForm from "../components/EntityForm.jsx";

import { addAppointment } from "../services/appointmentService.js";
import { getPatients } from "../services/patientService.js";
import { getDoctors } from "../services/doctorService.js";

export default function AddAppointment() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientsResponse, doctorsResponse] =
          await Promise.all([
            getPatients(),
            getDoctors(),
          ]);

        setPatients(
          Array.isArray(patientsResponse.data)
            ? patientsResponse.data
            : []
        );

        setDoctors(
          Array.isArray(doctorsResponse.data)
            ? doctorsResponse.data
            : []
        );
      } catch (err) {
        console.error("Failed to load appointment data:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load patients and doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          Loading patients and doctors...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: `${patient.name} (ID: ${patient.id})`,
  }));

  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: `${doctor.name} - ${doctor.specialization}`,
  }));

  return (
    <EntityForm
      title="Add Appointment"
      description="Create a new hospital appointment"
      fields={[
        {
          name: "patientId",
          label: "Patient",
          type: "select",
          options: patientOptions,
          placeholder: "Select Patient",
        },
        {
          name: "doctorId",
          label: "Doctor",
          type: "select",
          options: doctorOptions,
          placeholder: "Select Doctor",
        },
        {
          name: "appointmentDate",
          label: "Appointment Date",
          type: "date",
        },
        {
          name: "appointmentTime",
          label: "Appointment Time",
          type: "time",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            {
              value: "Scheduled",
              label: "Scheduled",
            },
            {
              value: "Completed",
              label: "Completed",
            },
            {
              value: "Cancelled",
              label: "Cancelled",
            },
          ],
          placeholder: "Select Status",
        },
        {
          name: "reason",
          label: "Reason",
          type: "textarea",
        },
      ]}
      initial={{
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        status: "Scheduled",
        reason: "",
      }}
      submitText="Save Appointment"
      successTo="/appointments"
      onSubmit={addAppointment}
    />
  );
}