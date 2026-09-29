import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../context/ToastContext.jsx";

import {
  deleteDepartment,
  getDepartments,
} from "../services/departmentService.js";

export default function Departments() {
  const { showToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDepartments();

      setDepartments(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      console.error(
        "Failed to load departments:",
        e
      );

      setError(
        e.response?.data?.message ||
          "Failed to load departments."
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

      await deleteDepartment(deleteId);

      setDeleteId(null);

      showToast(
        "Department deleted successfully.",
        "success"
      );

      await load();
    } catch (e) {
      console.error(
        "Failed to delete department:",
        e
      );

      const message =
        e.response?.data?.message ||
        "Failed to delete department.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) => {
      const name = String(
        department.name ?? ""
      ).toLowerCase();

      const description = String(
        department.description ?? ""
      ).toLowerCase();

      const location = String(
        department.location ?? ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        location.includes(query)
      );
    });
  }, [departments, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage hospital departments</p>
        </div>

        <Link
          className="primary-button"
          to="/departments/add"
        >
          + Add Department
        </Link>
      </div>

      <ErrorMessage message={error} />

      {!loading && departments.length > 0 && (
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
              placeholder="Search by department, description or location..."
              aria-label="Search departments"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear department search"
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
                  {filteredDepartments.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {departments.length}
                </strong>{" "}
                departments
              </>
            ) : (
              <>
                <strong>
                  {departments.length}
                </strong>{" "}
                departments
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading departments...
        </div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <strong>
            No departments found.
          </strong>

          <span>
            Add a department to see it here.
          </span>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="empty-state">
          <strong>
            No matching departments found.
          </strong>

          <span>
            Try a different department name,
            description, or location.
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
                <th>Description</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map(
                (department) => (
                  <tr key={department.id}>
                    <td>
                      {department.name || "—"}
                    </td>

                    <td>
                      {department.description ||
                        "—"}
                    </td>

                    <td>
                      {department.location ||
                        "—"}
                    </td>

                    <td>
                      <div className="actions">
                        <Link
                          to={`/departments/edit/${department.id}`}
                        >
                          Edit
                        </Link>

                        <button
                          className="danger-link"
                          onClick={() =>
                            openDeleteDialog(
                              department.id
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
        title="Delete Department?"
        message="Are you sure you want to delete this department? This action cannot be undone."
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Department"
        }
        cancelText="Cancel"
        onConfirm={remove}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}