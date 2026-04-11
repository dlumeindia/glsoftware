import { useNavigate } from "react-router-dom";
import { FiPlus, FiX, FiCheckCircle, FiTruck } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import Button from "../../components/Button";
import ConfirmBox from "../../components/ConfirmBox";
  import { useEffect } from "react";



const transportModes = ["Road", "Rail", "Air", "Ship"];

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#111827",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  cursor: "pointer",
};

const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#374151", textTransform: "uppercase" }}>
      {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

const Err = ({ field, errors }) =>
  errors[field]
    ? (
        <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>
          {errors[field]}
        </span>
      )
    : null;

// ─── E-Way Bill Modal ────────────────────────────────────────────────────────
function EWayBillModal({ invoice, onClose, onGenerate }) {
  console.log(invoice);
  const [form, setForm] = useState({
    ewayBillNo: `${invoice.eway_bill_no ?? ''}`, ewayBillDate: `${invoice.eway_bill_date ?? ''}`, ewayValidUpto: `${invoice.eway_valid_upto ?? ''}`,
    transportMode: `${invoice.transport_mode ?? 'Road'}`, vehicleNo: `${invoice.vehicle_no ?? ''}`, transporterName: `${invoice.transporter_name ?? ''}`,
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.ewayBillNo.trim()) e.ewayBillNo = "E-Way Bill No. is required";
    if (!form.ewayBillDate) e.ewayBillDate = "E-Way Bill Date is required";
    if (!form.ewayValidUpto) e.ewayValidUpto = "Valid Upto date is required";
    if (!form.vehicleNo.trim()) e.vehicleNo = "Vehicle No. is required";
    return e;
  };

  const handleGenerate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onGenerate(invoice.id, { ...form, generatedAt: new Date().toISOString() });
  };



  const inp = (field) => ({ ...inputStyle, borderColor: errors[field] ? "#ef4444" : "#e5e7eb" });


  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, width: "min(520px, 95vw)", background: "#fff", borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1.5px solid #e5e7eb", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiTruck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0b1324" }}>E-Way Bill Details</div>
              <div style={{ fontSize: "11.5px", color: "#6b7280", marginTop: "1px" }}>{invoice.number} · {invoice.client}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
            <FiX size={16} />
          </button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field label="E-Way Bill No." required>
            <input value={form.ewayBillNo} onChange={(e) => update("ewayBillNo", e.target.value)} 
              style={{ ...inp("ewayBillNo"), fontFamily: "monospace" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = errors.ewayBillNo ? "#ef4444" : "#e5e7eb"} />
<Err field="ewayBillNo" errors={errors} />     
     </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Field label="E-Way Bill Date" required>
              <input type="date" value={form.ewayBillDate} onChange={(e) => update("ewayBillDate", e.target.value)} style={inp("ewayBillDate")}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = errors.ewayBillDate ? "#ef4444" : "#e5e7eb"} />
              <Err field="ewayBillDate" errors={errors} />
            </Field>
            <Field label="Valid Upto" required>
              <input type="date" value={form.ewayValidUpto} onChange={(e) => update("ewayValidUpto", e.target.value)} style={inp("ewayValidUpto")}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = errors.ewayValidUpto ? "#ef4444" : "#e5e7eb"} />
              <Err field="ewayValidUpto" errors={errors} />
            </Field>
          </div>
          <Field label="Transport Mode">
            <select value={form.transportMode} onChange={(e) => update("transportMode", e.target.value)} style={selectStyle}>
              {transportModes.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Vehicle No." required>
            <input value={form.vehicleNo} onChange={(e) => update("vehicleNo", e.target.value.toUpperCase())} 
              style={{ ...inp("vehicleNo"), fontFamily: "monospace" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = errors.vehicleNo ? "#ef4444" : "#e5e7eb"} />
            <Err field="vehicleNo" errors={errors} />
          </Field>
          <Field label="Transporter Name">
            <input value={form.transporterName} onChange={(e) => update("transporterName", e.target.value)} 
              style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1.5px solid #e5e7eb", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleGenerate} style={{ padding: "10px 24px", border: "none", borderRadius: "8px", background: "#1e3a5f", fontSize: "13px", fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <FiTruck size={14} /> Save E-Way Bill
          </button>
        </div>
      </div>
    </>
  );
}

// ─── E-Way Bill Button ───────────────────────────────────────────────────────
function EWayBillButton({ invoice, onOpen }) {
  if (invoice.ewayBill) {
    return (
<button onClick={(e) => { e.stopPropagation(); onOpen(invoice); }}
      style={{
  display: "inline-flex",   // ✅ important (not full width)
  alignItems: "center",
  gap: "4px",               // smaller spacing
  padding: "3px 8px",       // ✅ compact
  borderRadius: "6px",
  background: "#f0fdf4",
  border: "1px solid #86efac", // thinner border
  fontSize: "11px",         // smaller text
  fontWeight: 600,
  color: "#16a34a",
  whiteSpace: "nowrap"
}}>
       <FiCheckCircle size={11} /> E-Way 
    </button> 
     
    );
  }
  return (
    <button onClick={(e) => { e.stopPropagation(); onOpen(invoice); }}
      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 6px", borderRadius: "8px", background: "#eff6ff", border: "1.5px solid #bfdbfe", fontSize: "12px", fontWeight: 700, color: "#1d4ed8", cursor: "pointer", whiteSpace: "nowrap" }}>
      <FiTruck size={13} /> E-Way 
    </button>
  );
}

// ─── Mark as Paid Button ─────────────────────────────────────────────────────
function MarkAsPaidButton({ invoice, onToggleStatus }) {
  const isPaid = invoice.status === "Paid";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleStatus(invoice.id, isPaid);
        
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 6px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        cursor: "pointer",
        border: isPaid ? "1.5px solid #86efac" : "1.5px solid #fed7aa",
        background: isPaid ? "#f0fdf4" : "#fff7ed",
        color: isPaid ? "#16a34a" : "#ea580c",
      }}
    >
      <FiCheckCircle size={13} />
      {isPaid ? "Paid" : "Unpaid"}
    </button>
  );
}

// ─── Main Invoices Page ──────────────────────────────────────────────────────


const Invoices = () => {

  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

 const [confirmOpen, setConfirmOpen] = useState(false);
 const [confirmsOpen, setConfirmsOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [actionType, setActionType] = useState("");

  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [ewayModal, setEwayModal] = useState(null);

  

 const handleDelete = async (invoice) => {
 

  const res = await window.electronAPI.deleteInvoice(invoice.id);

  if (res.success) {
    setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
  }
};



const handleToggleStatus = async (invoiceId, isPaid) => {
  setSelectedId(invoiceId);
  setActionType(isPaid); // "paid" or "unpaid"
  setConfirmsOpen(true);
  // const invoice = invoices.find((inv) => inv.id === invoiceId);

  // const confirmMsg = isPaid
  //   ? `Mark Invoice #${invoice?.number} as Unpaid?`
  //   : `Mark Invoice #${invoice?.number} as Paid?`;
 

  // const res = await window.electronAPI.markInvoicePaid({
  //   id: invoiceId,
  //   status: isPaid ? "Unpaid" : "Paid",
  // });

  // if (res.success) {
  //   setInvoices((prev) =>
  //     prev.map((inv) =>
  //       inv.id === invoiceId
  //         ? { ...inv, status: isPaid ? "Unpaid" : "Paid" }
  //         : inv
  //     )
  //   );
  // }
};

  const handleGenerateEway = async (invoiceId, ewayData) => {
    const res = await window.electronAPI.saveEway({
      id: invoiceId,
      data: ewayData,
    });

    if (res.success) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, ewayBill: ewayData } : inv
        )
      );
    }

    setEwayModal(null);
  };



  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await window.electronAPI.getInvoices();

      if (res.success) {
        const formatted = res.data.map((inv) => ({
          id: inv.id,
          number: inv.invoice_no,
          company: inv.bill_company_name,
          customer: inv.customer_name,
          amount: `₹ ${Number(inv.grand_total).toLocaleString("en-IN")}`,
          dueDate: inv.invoice_date,
          status: inv.status,
          ewayBill: inv.eway_enabled,  
          vehicle_no: inv.vehicle_no,  
          transporter_name: inv.transporter_name,  
          doc_type: inv.doc_type,  
          distance: inv.distance,  
          transporter_doc: inv.transporter_doc,  
          transport_mode: inv.transport_mode,  
          from_place: inv.from_place,  
          eway_bill_no: inv.eway_bill_no,  
          eway_bill_date: inv.eway_bill_date,  
          eway_valid_upto: inv.eway_valid_upto,  
          generated_at: inv.generated_at,  
        }));

        setInvoices(formatted);
      }
    } catch (err) {
      console.error("❌ Load Invoice Error:", err);
    }
  };
const columns = [
  { key: "number", label: "Invoice #" },

  { key: "company", label: "Company" },   // ✅ NEW
  { key: "customer", label: "Customer" }, // ✅ NEW

  { key: "amount", label: "Amount" },

  {
    key: "status",
    label: "Status",
    render: (_, row) => (
   <MarkAsPaidButton
  invoice={row}
  onToggleStatus={handleToggleStatus}
/>
    ),
  },

  {
    key: "ewayBill",
    label: "E-Way Bill",
    render: (_, row) => (
      <EWayBillButton invoice={row} onOpen={setEwayModal} />
    ),
  },
];


const filteredInvoices = invoices.filter((inv) => {
  if (!fromDate && !toDate) return true;

  const invoiceDate = new Date(inv.dueDate);

  if (fromDate && new Date(fromDate) > invoiceDate) return false;
  if (toDate && new Date(toDate) < invoiceDate) return false;

  return true;
});

  return (
    <div className="space-y-6">
        <ConfirmBox
          open={confirmOpen}
          title="Delete Customer"
          message="Are you sure you want to delete this customer?"
          confirmText="Delete"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setConfirmOpen(false);

            try {
                const res = await window.electronAPI.deleteInvoice(selectedId);

            
              if (res.success) {
                setInvoices((prev) => prev.filter((i) => i.id !== selectedId));
                toast.success("Invoice deleted successfully");
              } else {
                toast.error("Failed to delete Invoice");
              }
            } catch {
              toast.error("Something went wrong");
            }
          }}
        />
         <ConfirmBox
          open={confirmsOpen}
          title={`Mark as ${actionType ?  "Unpaid" : "Paid"}`}
          message={`Are you sure you want to mark this invoice as ${
            actionType ? "Unpaid" : "Paid"
          }?`}
          onCancel={() => setConfirmsOpen(false)}
          onConfirm={async () => {
            setConfirmsOpen(false);

            const invoice = invoices.find((inv) => inv.id === selectedId);

            const isPaid = invoice.status;
          
          

            const res = await window.electronAPI.markInvoicePaid({
              id: selectedId,
              status: actionType ? "Unpaid" : "Paid",
            });

            if (res.success) {
               toast.success("Invoice status updated successfully");
              setInvoices((prev) =>
                          prev.map((inv) =>
                            inv.id === selectedId
                              ? { ...inv, status: actionType ? "Unpaid" : "Paid" }
                              : inv
                          )
                        );
                      }
          }}
        />
    <div className="flex items-center justify-between">
  <Button variant="navy" size="md" className="flex items-center gap-2" onClick={() => navigate("/create-invoice")}>
    <FiPlus size={16} /> Create Invoice
  </Button>

  <div style={{
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "10px 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  }}>
    <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", color: "#6b7280", textTransform: "uppercase" }}>
      Date range
    </span>
    <div style={{ width: "1px", height: "18px", background: "#e5e7eb" }} />
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <label style={{ fontSize: "12px", color: "#6b7280" }}>From</label>
      <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
        style={{ fontSize: "12px", padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fff", color: "#111827", outline: "none" }} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <label style={{ fontSize: "12px", color: "#6b7280" }}>To</label>
      <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
        style={{ fontSize: "12px", padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fff", color: "#111827", outline: "none" }} />
    </div>
    {(fromDate || toDate) && (
      <button onClick={() => { setFromDate(""); setToDate(""); }}
        style={{ fontSize: "12px", padding: "5px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "transparent", color: "#6b7280", cursor: "pointer" }}>
        Clear
      </button>
    )}
  </div>
</div>
      <Table
        columns={columns}
        data={filteredInvoices}
        searchPlaceholder="Search invoices..."
        onRowClick={(row) => navigate(`/invoice/${row.id}`)}
        onDelete={(row) => {
          setSelectedId(row.id);
          setConfirmOpen(true);
        }}
      
      />

      {ewayModal && (
        <EWayBillModal
          invoice={ewayModal}
          onClose={() => setEwayModal(null)}
          onGenerate={handleGenerateEway}
        />
      )}
    </div>
  );
};

export default Invoices;