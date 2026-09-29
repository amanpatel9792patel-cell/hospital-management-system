import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../context/ToastContext.jsx";

import {
  deleteDoctor,
  getDoctors,
} from "../services/doctorService.js";

export default function DoctorsList() {
  const { showToast } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctors();

      setDoctors(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      console.error(
        "Failed to load doctors:",
        e
      );

      setError(
        e.response?.data?.message ||
          "Failed to load doctors."
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

      await deleteDoctor(deleteId);

      setDeleteId(null);

      showToast(
        "Doctor deleted successfully.",
        "success"
      );

      await load();
    } catch (e) {
      console.error(
        "Failed to delete doctor:",
        e
      );

      const message =
        e.response?.data?.message ||
        "Failed to delete doctor.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const getDepartmentName = (doctor) => {
    if (typeof doctor.department === "string") {
      return doctor.department;
    }

    if (
      doctor.department &&
      typeof doctor.department === "object"
    ) {
      return (
        doctor.department.name ||
        (doctor.department.id
          ? `Department #${doctor.department.id}`
          : "—")
      );
    }

    if (doctor.departmentName) {
      return doctor.departmentName;
    }

    return "—";
  };

  const getDepartmentSearchValue = (doctor) => {
    return getDepartmentName(doctor)
      .toLowerCase();
  };

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      const name = String(
        doctor.name ?? ""
      ).toLowerCase();

      const specialization = String(
        doctor.specialization ?? ""
      ).toLowerCase();

      const phone = String(
        doctor.phone ?? ""
      ).toLowerCase();

      const email = String(
        doctor.email ?? ""
      ).toLowerCase();

      const department =
        getDepartmentSearchValue(doctor);

      return (
        name.includes(query) ||
        specialization.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        department.includes(query)
      );
    });
  }, [doctors, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p>Manage hospital doctors</p>
        </div>

        <Link
          className="primary-button"
          to="/doctors/add"
        >
          + Add Doctor
        </Link>
      </div>

      <ErrorMessage message={error} />

      {!loading && doctors.length > 0 && (
        <div className="filter-card">
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
              placeholder="Search by name, specialization, department, phone or email..."
              aria-label="Search doctors"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear doctor search"
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-summary">
            {search ? (
              <>
                Showing{" "}
                <strong>
                  {filteredDoctors.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {doctors.length}
                </strong>{" "}
                doctors
              </>
            ) : (
              <>
                <strong>
                  {doctors.length}
                </strong>{" "}
                doctors
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading doctors...
        </div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <strong>No doctors found.</strong>

          <span>
            Add a doctor to see them here.
          </span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <strong>
            No matching doctors found.
          </strong>

          <span>
            Try a different name, specialization,
            department, phone number, or email.
          </span>

          <button
            type="button"
            className="secondary-button"
            onClick={clearSearch}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map(
                (doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      {doctor.name || "—"}
                    </td>

                    <td>
                      {doctor.specialization ||
                        "—"}
                    </td>

                    <td>
                      {getDepartmentName(
                        doctor
                      )}
                    </td>

                    <td>
                      {doctor.experience !==
                        undefined &&
                      doctor.experience !== null
                        ? `${doctor.experience} years`
                        : "—"}
                    </td>

                    <td>
                      {doctor.phone || "—"}
                    </td>

                    <td>
                      {doctor.email || "—"}
                    </td>

                    <td>
                      <div className="actions">
                        <Link
                          to={`/doctors/edit/${doctor.id}`}
                        >
                          Edit
                        </Link>

                        <button
                          className="danger-link"
                          onClick={() =>
                            openDeleteDialog(
                              doctor.id
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
        title="Delete Doctor?"
        message="Are you sure you want to delete this doctor? This action cannot be undone."
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Doctor"
        }
        cancelText="Cancel"
        onConfirm={remove}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}