export default function ConfirmDialog({
  open,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this record?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="confirm-dialog"
        onClick={(e) =>
          e.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="confirm-icon">
          ⚠️
        </div>

        <h2 id="confirm-dialog-title">
          {title}
        </h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}