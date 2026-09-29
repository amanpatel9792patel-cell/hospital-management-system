import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getPatients } from "../services/patientService.js";
import { getDoctors } from "../services/doctorService.js";
import { getDepartments } from "../services/departmentService.js";
import { getAppointments } from "../services/appointmentService.js";

const cards = [
  [
    "/patients",
    "👥",
    "Patients",
    "Manage hospital patients",
    "patients",
  ],
  [
    "/doctors",
    "👨‍⚕️",
    "Doctors",
    "Manage doctors and specializations",
    "doctors",
  ],
  [
    "/appointments",
    "📅",
    "Appointments",
    "Schedule and manage appointments",
    "appointments",
  ],
  [
    "/departments",
    "🏢",
    "Departments",
    "Manage hospital departments",
    "departments",
  ],
];

const emptyCounts = {
  patients: 0,
  doctors: 0,
  appointments: 0,
  departments: 0,
};

export default function Dashboard() {
  const [counts, setCounts] =
    useState(emptyCounts);

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
        departmentsResponse,
      ] = await Promise.all([
        getPatients(),
        getDoctors(),
        getAppointments(),
        getDepartments(),
      ]);

      const patients = Array.isArray(
        patientsResponse.data
      )
        ? patientsResponse.data
        : [];

      const doctors = Array.isArray(
        doctorsResponse.data
      )
        ? doctorsResponse.data
        : [];

      const appointmentData = Array.isArray(
        appointmentsResponse.data
      )
        ? appointmentsResponse.data
        : [];

      const departments = Array.isArray(
        departmentsResponse.data
      )
        ? departmentsResponse.data
        : [];

      setCounts({
        patients: patients.length,
        doctors: doctors.length,
        appointments:
          appointmentData.length,
        departments: departments.length,
      });

      setAppointments(appointmentData);
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getPatientName = (appointment) => {
    return (
      appointment.patientName ||
      appointment.patient?.name ||
      `Patient #${appointment.patientId}`
    );
  };

  const getDoctorName = (appointment) => {
    return (
      appointment.doctorName ||
      appointment.doctor?.name ||
      `Doctor #${appointment.doctorId}`
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parts = String(date).split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return String(date);
  };

  const formatTime = (time) => {
    if (!time) return "";

    return String(time).slice(0, 5);
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "status-badge status-default";
    }

    const normalized = String(status)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    switch (normalized) {
      case "scheduled":
        return "status-badge status-scheduled";

      case "confirmed":
        return "status-badge status-confirmed";

      case "completed":
        return "status-badge status-completed";

      case "cancelled":
      case "canceled":
        return "status-badge status-cancelled";

      case "pending":
        return "status-badge status-pending";

      case "in_progress":
      case "in-progress":
        return "status-badge status-in-progress";

      default:
        return "status-badge status-default";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => {
        const dateA = String(
          a.appointmentDate ||
            a.date ||
            ""
        );

        const dateB = String(
          b.appointmentDate ||
            b.date ||
            ""
        );

        const timeA = String(
          a.appointmentTime ||
            a.time ||
            ""
        );

        const timeB = String(
          b.appointmentTime ||
            b.time ||
            ""
        );

        const valueA = `${dateA}T${timeA}`;
        const valueB = `${dateB}T${timeB}`;

        return valueB.localeCompare(valueA);
      })
      .slice(0, 5);
  }, [appointments]);

  const statusSummary = useMemo(() => {
    const summary = {
      pending: 0,
      scheduled: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    appointments.forEach(
      (appointment) => {
        const status = String(
          appointment.status ?? ""
        )
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, "_");

        if (
          Object.prototype.hasOwnProperty.call(
            summary,
            status
          )
        ) {
          summary[status] += 1;
        }
      }
    );

    return summary;
  }, [appointments]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Hospital Management System overview
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <div>
            <strong>
              Unable to load dashboard.
            </strong>

            <div>{error}</div>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading
              ? "Retrying..."
              : "Retry"}
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        {cards.map(
          ([to, icon, title, text, key]) => (
            <Link
              className="dashboard-card"
              to={to}
              key={to}
            >
              <div className="card-icon">
                {icon}
              </div>

              <div className="dashboard-card-content">
                <h3>{title}</h3>

                <p>{text}</p>

                <strong className="dashboard-count">
                  {loading ? (
                    <span className="dashboard-loading">
                      Loading...
                    </span>
                  ) : (
                    counts[key]
                  )}
                </strong>
              </div>
            </Link>
          )
        )}
      </div>

      <div className="dashboard-lower-grid">
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Recent Appointments</h2>

              <p>
                Latest scheduled hospital
                appointments
              </p>
            </div>

            <Link
              className="dashboard-section-link"
              to="/appointments"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="dashboard-section-loading">
              Loading appointments...
            </div>
          ) : recentAppointments.length ===
            0 ? (
            <div className="dashboard-section-empty">
              <div className="dashboard-empty-icon">
                📅
              </div>

              <strong>
                No appointments yet
              </strong>

              <span>
                Create an appointment to see
                it here.
              </span>

              <Link
                className="secondary-button"
                to="/appointments/add"
              >
                Add Appointment
              </Link>
            </div>
          ) : (
            <div className="recent-appointments">
              {recentAppointments.map(
                (appointment) => (
                  <Link
                    key={appointment.id}
                    className="recent-appointment"
                    to={`/appointments/edit/${appointment.id}`}
                  >
                    <div className="recent-appointment-main">
                      <strong>
                        {getPatientName(
                          appointment
                        )}
                      </strong>

                      <span>
                        Dr.{" "}
                        {getDoctorName(
                          appointment
                        )}
                      </span>

                      <small>
                        {formatDate(
                          appointment.appointmentDate ||
                            appointment.date
                        )}

                        {" • "}

                        {formatTime(
                          appointment.appointmentTime ||
                            appointment.time
                        ) || "Time not set"}
                      </small>
                    </div>

                    <div className="recent-appointment-side">
                      <span
                        className={getStatusClass(
                          appointment.status
                        )}
                      >
                        <span className="status-dot"></span>

                        {formatStatus(
                          appointment.status
                        )}
                      </span>

                      <span className="recent-reason">
                        {appointment.reason ||
                          "No reason provided"}
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Appointment Status</h2>

              <p>
                Current appointment breakdown
              </p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-section-loading">
              Loading status summary...
            </div>
          ) : appointments.length === 0 ? (
            <div className="dashboard-section-empty compact">
              <div className="dashboard-empty-icon">
                📊
              </div>

              <strong>
                No appointment data
              </strong>

              <span>
                Status statistics will appear
                here.
              </span>
            </div>
          ) : (
            <div className="status-summary-grid">
              <Link
                to="/appointments"
                className="status-summary-item status-summary-pending"
              >
                <span className="status-summary-label">
                  Pending
                </span>

                <strong>
                  {statusSummary.pending}
                </strong>
              </Link>

              <Link
                to="/appointments"
                className="status-summary-item status-summary-scheduled"
              >
                <span className="status-summary-label">
                  Scheduled
                </span>

                <strong>
                  {statusSummary.scheduled}
                </strong>
              </Link>

              <Link
                to="/appointments"
                className="status-summary-item status-summary-confirmed"
              >
                <span className="status-summary-label">
                  Confirmed
                </span>

                <strong>
                  {statusSummary.confirmed}
                </strong>
              </Link>

              <Link
                to="/appointments"
                className="status-summary-item status-summary-progress"
              >
                <span className="status-summary-label">
                  In Progress
                </span>

                <strong>
                  {statusSummary.in_progress}
                </strong>
              </Link>

              <Link
                to="/appointments"
                className="status-summary-item status-summary-completed"
              >
                <span className="status-summary-label">
                  Completed
                </span>

                <strong>
                  {statusSummary.completed}
                </strong>
              </Link>

              <Link
                to="/appointments"
                className="status-summary-item status-summary-cancelled"
              >
                <span className="status-summary-label">
                  Cancelled
                </span>

                <strong>
                  {statusSummary.cancelled}
                </strong>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}