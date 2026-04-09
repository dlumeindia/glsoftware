import { FiX } from "react-icons/fi";
import Customers from "../pages/Customers/Customers";

export default function CustomerModal({ onClose, onCustomerCreated }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999, // 🔥 FIXED
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000, // 🔥 FIXED
          width: "min(1000px, 95vw)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1.5px solid #e5e7eb",
            background: "#f8fafc",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "15px" }}>
            Add Customer
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "8px",
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
          >
            <FiX />
          </button>
        </div>

        {/* Body (SCROLL FIX) */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
          }}
        >
         <Customers
  onSuccess={(customer) => {
    alert("✅ Customer saved successfully");

    onCustomerCreated && onCustomerCreated(customer);
  }}
/>
        </div>
      </div>
    </>
  );
}