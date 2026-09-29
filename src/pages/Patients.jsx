import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../context/ToastContext.jsx";

import {
  deletePatient,
  getPatients,
} from "../services/patientService.js";

export default function Patients() {
  const { showToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPatients();

      setPatients(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      console.error(
        "Failed to load patients:",
        e
      );

      setError(
        e.response?.data?.message ||
          "Failed to load patients."
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

      await deletePatient(deleteId);

      setDeleteId(null);

      showToast(
        "Patient deleted successfully.",
        "success"
      );

      await load();
    } catch (e) {
      console.error(
        "Failed to delete patient:",
        e
      );

      const message =
        e.response?.data?.message ||
        "Failed to delete patient.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = String(
        patient.name ?? ""
      ).toLowerCase();

      const phone = String(
        patient.phone ?? ""
      ).toLowerCase();

      const disease = String(
        patient.disease ?? ""
      ).toLowerCase();

      const gender = String(
        patient.gender ?? ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        phone.includes(query) ||
        disease.includes(query) ||
        gender.includes(query)
      );
    });
  }, [patients, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Manage hospital patients</p>
        </div>

        <Link
          className="primary-button"
          to="/patients/add"
        >
          + Add Patient
        </Link>
      </div>

      <ErrorMessage message={error} />

      {!loading && patients.length > 0 && (
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
              placeholder="Search by name, phone, disease or gender..."
              aria-label="Search patients"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear patient search"
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
                  {filteredPatients.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {patients.length}
                </strong>{" "}
                patients
              </>
            ) : (
              <>
                <strong>
                  {patients.length}
                </strong>{" "}
                patients
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading patients...
        </div>
      ) : patients.length === 0 ? (
        <div className="empty-state">
          <strong>No patients found.</strong>

          <span>
            Add a patient to see them here.
          </span>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="empty-state">
          <strong>
            No matching patients found.
          </strong>

          <span>
            Try a different name, phone number,
            disease, or gender.
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
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Disease</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map(
                (patient) => (
                  <tr key={patient.id}>
                    <td>
                      {patient.name || "—"}
                    </td>

                    <td>
                      {patient.age ?? "—"}
                    </td>

                    <td>
                      {patient.gender || "—"}
                    </td>

                    <td>
                      {patient.phone || "—"}
                    </td>

                    <td>
                      {patient.disease || "—"}
                    </td>

                    <td>
                      <div className="actions">
                        <Link
                          to={`/patients/edit/${patient.id}`}
                        >
                          Edit
                        </Link>

                        <button
                          className="danger-link"
                          onClick={() =>
                            openDeleteDialog(
                              patient.id
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
        title="Delete Patient?"
        message="Are you sure you want to delete this patient? This action cannot be undone."
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Patient"
        }
        cancelText="Cancel"
        onConfirm={remove}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}