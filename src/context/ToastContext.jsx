import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  };

  const showToast = (
    message,
    type = "success",
    duration = 3000
  ) => {
    const id = Date.now() + Math.random();

    setToasts((current) => [
      ...current,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <span className="toast-icon">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "!"
                : "i"}
            </span>

            <span className="toast-message">
              {toast.message}
            </span>

            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}