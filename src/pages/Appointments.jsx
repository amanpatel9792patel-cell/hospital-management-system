import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../context/ToastContext.jsx";

import {
  deleteAppointment,
  getAppointments,
} from "../services/appointmentService.js";

export default function Appointments() {
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAppointments();

      setItems(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      console.error(
        "Failed to load appointments:",
        e
      );

      setError(
        e.response?.data?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setError("");
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteId(null);
  };

  const remove = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await deleteAppointment(deleteId);

      setDeleteId(null);

      showToast(
        "Appointment deleted successfully.",
        "success"
      );

      await load();
    } catch (e) {
      console.error(
        "Failed to delete appointment:",
        e
      );

      const message =
        e.response?.data?.message ||
        "Failed to delete appointment.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

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

    return date;
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

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((appointment) => {
      const patientName = getPatientName(
        appointment
      ).toLowerCase();

      const doctorName = getDoctorName(
        appointment
      ).toLowerCase();

      const reason = String(
        appointment.reason ?? ""
      ).toLowerCase();

      const date = String(
        appointment.appointmentDate ||
          appointment.date ||
          ""
      ).toLowerCase();

      const status = String(
        appointment.status ?? ""
      )
        .trim()
        .toUpperCase();

      const matchesSearch =
        !query ||
        patientName.includes(query) ||
        doctorName.includes(query) ||
        reason.includes(query) ||
        date.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage hospital appointments</p>
        </div>

        <Link
          className="primary-button"
          to="/appointments/add"
        >
          + Add Appointment
        </Link>
      </div>

      <ErrorMessage message={error} />

      {!loading && items.length > 0 && (
        <div className="filter-card">
          <div className="appointment-filter-row">
            <div className="search-box">
              <span className="search-icon">
                🔍
              </span>

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient, doctor, reason or date..."
                aria-label="Search appointments"
              />

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear appointment search"
                >
                  ×
                </button>
              )}
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              aria-label="Filter appointments by status"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="PENDING">
                Pending
              </option>
              <option value="SCHEDULED">
                Scheduled
              </option>
              <option value="CONFIRMED">
                Confirmed
              </option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="COMPLETED">
                Completed
              </option>
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

            {hasFilters && (
              <button
                type="button"
                className="secondary-button filter-clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="filter-summary">
            {hasFilters ? (
              <>
                Showing{" "}
                <strong>
                  {filteredAppointments.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {items.length}
                </strong>{" "}
                appointments
              </>
            ) : (
              <>
                <strong>
                  {items.length}
                </strong>{" "}
                appointments
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading appointments...
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <strong>
            No appointments found.
          </strong>

          <span>
            Add an appointment to see it here.
          </span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <strong>
            No matching appointments found.
          </strong>

          <span>
            Try a different search term or status
            filter.
          </span>

          <button
            type="button"
            className="secondary-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map(
                (appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {getPatientName(
                        appointment
                      )}
                    </td>

                    <td>
                      {getDoctorName(
                        appointment
                      )}
                    </td>

                    <td>
                      {formatDate(
                        appointment.appointmentDate ||
                          appointment.date
                      )}
                    </td>

                    <td>
                      {formatTime(
                        appointment.appointmentTime ||
                          appointment.time
                      ) || "—"}
                    </td>

                    <td>
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
                    </td>

                    <td>
                      {appointment.reason ||
                        "—"}
                    </td>

                    <td>
                      <div className="actions">
                        <Link
                          to={`/appointments/edit/${appointment.id}`}
                        >
                          Edit
                        </Link>

                        <button
                          className="danger-link"
                          onClick={() =>
                            openDeleteDialog(
                              appointment.id
                            )
                          }
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Appointment?"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Appointment"
        }
        cancelText="Cancel"
        onConfirm={remove}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}