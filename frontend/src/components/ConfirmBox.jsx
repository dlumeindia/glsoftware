import React from "react";

export default function ConfirmBox({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <h3 style={{ marginBottom: "8px" }}>{title}</h3>
        <p style={{ fontSize: "13px", marginBottom: "16px" }}>
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>

          <button onClick={onConfirm} style={deleteBtn}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const boxStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const cancelBtn = {
  padding: "8px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  background: "#f9fafb",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};