export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  // =========================
  // FORBIDDEN
  // =========================

  if (error?.response?.status === 403) {
    return (
      error.userMessage ||
      "You do not have permission to perform this action."
    );
  }

  // =========================
  // UNAUTHORIZED
  // =========================

  if (error?.response?.status === 401) {
    return "Your session has expired. Please login again.";
  }

  // =========================
  // VALIDATION ERROR
  // =========================

  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;

    const firstError = Object.values(errors)[0];

    if (firstError) {
      return String(firstError);
    }
  }

  // =========================
  // BACKEND MESSAGE
  // =========================

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // =========================
  // NETWORK ERROR
  // =========================

  if (
    error?.code === "ERR_NETWORK" ||
    !error?.response
  ) {
    return "Unable to connect to the server. Please check your connection.";
  }

  // =========================
  // FALLBACK
  // =========================

  return fallback;
}