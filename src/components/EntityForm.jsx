import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ErrorMessage from "./ErrorMessage.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function EntityForm({
  title,
  description,
  fields,
  initial,
  submitText,
  successTo,
  onSubmit,
  load,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(Boolean(load));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!load) return;

    const loadRecord = async () => {
      try {
        setLoading(true);
        setError("");
        setFieldErrors({});

        const response = await load(id);

        const loadedData = {
          ...initial,
          ...response.data,
        };

        if (loadedData.appointmentTime) {
          loadedData.appointmentTime = String(
            loadedData.appointmentTime
          ).slice(0, 5);
        }

        if (
          loadedData.patientId !== undefined &&
          loadedData.patientId !== null
        ) {
          loadedData.patientId = String(
            loadedData.patientId
          );
        }

        if (
          loadedData.doctorId !== undefined &&
          loadedData.doctorId !== null
        ) {
          loadedData.doctorId = String(
            loadedData.doctorId
          );
        }

        setForm(loadedData);
      } catch (e) {
        console.error(
          "Failed to load record:",
          e
        );

        setError(
          e.response?.data?.message ||
            "Failed to load record. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id]);

  const change = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }
  };

  const validate = () => {
    const errors = {};

    for (const field of fields) {
      const value = String(
        form[field.name] ?? ""
      ).trim();

      if (!value) {
        errors[field.name] =
          `${field.label} is required.`;

        continue;
      }

      if (
        field.type === "number" &&
        Number.isNaN(Number(value))
      ) {
        errors[field.name] =
          `${field.label} must be a valid number.`;
      }

      if (
        field.type === "number" &&
        Number(value) < 0
      ) {
        errors[field.name] =
          `${field.label} cannot be negative.`;
      }

      if (
        field.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors[field.name] =
          "Please enter a valid email address.";
      }

      if (
        field.name === "phone" &&
        !/^[0-9+\-\s()]{7,20}$/.test(value)
      ) {
        errors[field.name] =
          "Please enter a valid phone number.";
      }

      if (
        field.name === "age" &&
        Number(value) > 150
      ) {
        errors[field.name] =
          "Please enter a valid age.";
      }

      if (
        field.name === "experience" &&
        Number(value) > 80
      ) {
        errors[field.name] =
          "Please enter a valid experience value.";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const getEntityName = () => {
    return title
      .replace(/^Add\s+/i, "")
      .replace(/^Edit\s+/i, "")
      .trim();
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...form,
      };

      if (
        data.age !== undefined &&
        data.age !== ""
      ) {
        data.age = Number(data.age);
      }

      if (
        data.experience !== undefined &&
        data.experience !== ""
      ) {
        data.experience = Number(
          data.experience
        );
      }

      if (
        data.patientId !== undefined &&
        data.patientId !== ""
      ) {
        data.patientId = Number(
          data.patientId
        );
      }

      if (
        data.doctorId !== undefined &&
        data.doctorId !== ""
      ) {
        data.doctorId = Number(
          data.doctorId
        );
      }

      if (load) {
        await onSubmit(id, data);

        showToast(
          `${getEntityName()} updated successfully.`,
          "success"
        );
      } else {
        await onSubmit(data);

        showToast(
          `${getEntityName()} added successfully.`,
          "success"
        );
      }

      navigate(successTo);
    } catch (e) {
      console.error(
        "Form submission error:",
        e
      );

      setError(
        e.response?.data?.message ||
          `Failed to ${
            load ? "update" : "add"
          } record.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page form-page">
        <div className="loading-card">
          <div className="loading-spinner"></div>

          <strong>
            Loading record...
          </strong>

          <span>
            Please wait a moment.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page form-page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form
        className="entity-form"
        onSubmit={submit}
        noValidate
      >
        {fields.map((field) => (
          <label
            key={field.name}
            className={
              fieldErrors[field.name]
                ? "field-error"
                : ""
            }
          >
            <span className="field-label">
              {field.label}

              <span className="required-star">
                *
              </span>
            </span>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={
                  form[field.name] ?? ""
                }
                onChange={change}
                rows="4"
                disabled={saving}
                aria-invalid={Boolean(
                  fieldErrors[field.name]
                )}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                value={
                  form[field.name] ?? ""
                }
                onChange={change}
                disabled={saving}
                aria-invalid={Boolean(
                  fieldErrors[field.name]
                )}
              >
                <option value="">
                  {field.placeholder ||
                    `Select ${field.label}`}
                </option>

                {(field.options || []).map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            ) : (
              <input
                name={field.name}
                type={
                  field.type || "text"
                }
                value={
                  form[field.name] ?? ""
                }
                onChange={change}
                disabled={saving}
                aria-invalid={Boolean(
                  fieldErrors[field.name]
                )}
              />
            )}

            {fieldErrors[field.name] && (
              <span className="field-error-message">
                {fieldErrors[field.name]}
              </span>
            )}
          </label>
        ))}

        <div className="form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() =>
              navigate(successTo)
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="button-spinner"></span>
                Saving...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}