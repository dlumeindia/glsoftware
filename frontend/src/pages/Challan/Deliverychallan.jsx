import { useParams, useNavigate } from "react-router-dom";
import { FiPrinter, FiShare2, FiArrowLeft, FiDownload } from "react-icons/fi";
import Logo from "../../assets/logo.svg";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const mockChallans = [
  {
    id: 1,
    challanNo: "DC-1004",
    challanDate: "2025-09-15",
    againstInvoiceNo: "INV-1004",
    invoiceDate: "2025-09-15",
    transportMode: "By Road",
    vehicleNo: "MH-04-AB-1234",
    placeOfSupply: "Maharashtra",
    placeOfSupplyCode: "27",
    customer: {
      company_name: "AlphaWorks Ltd",
      gstin: "27AALCA1234F1ZV",
      pan: "AALCA1234F",
      phone: "9876543210",
      email: "accounts@alphaworks.com",
      address_line1: "101 Industrial Zone, MIDC",
      address_line2: "Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      state_code: "27",
      pincode: "400093",
    },
    shipping: {
      company_name: "AlphaWorks Ltd",
      address_line1: "101 Industrial Zone, MIDC",
      address_line2: "Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      state_code: "27",
      pincode: "400093",
    },
    items: [
      { description: "Control Panel Wiring", itemCode: "CPW-001", hsn: "85371000", unit: "NOS", qty: 2 },
      { description: "PLC Programming & Configuration", itemCode: "PLC-002", hsn: "85340000", unit: "SET", qty: 1 },
      { description: "Cable Tray Installation", itemCode: "CTI-003", hsn: "73089000", unit: "MTR", qty: 20 },
    ],
    termsAndConditions: "1. Goods dispatched as per delivery challan only.\n2. This is not a tax invoice.\n3. Subject to Navi Mumbai Jurisdiction.",
  },
];

const businessInfo = {
  name: "GLS TECHNOLOGIST",
  address: "Plot No. PAP-A-78, TTC Industrial Area, Pawane MIDC, Turbhe, Navi Mumbai, Maharashtra - 400709",
  state_code: "27",
  email: "glstechnologist2020@gmail.com",
  gst: "27AAUFG7297B1ZV",
  phone: "+91 98765 43210",
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const MetaRow = ({ label, value }) => (
  <div style={{ display: "grid", gridTemplateColumns: "130px 10px 1fr", alignItems: "start", marginBottom: "4px", fontSize: "12.5px" }}>
    <span style={{ color: "#4b5563", fontWeight: 600 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>:</span>
    <span style={{ color: "#111827", fontWeight: 700 }}>{value || "—"}</span>
  </div>
);

export default function DeliveryChallan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const challan = mockChallans.find((c) => c.id === Number(id)) || mockChallans[0];
  const { customer, shipping, items } = challan;

  const totalQty = items.reduce((s, i) => s + i.qty, 0);


  const cell = (extra = {}) => ({
    border: "1px solid #d1d5db",
    padding: "7px 10px",
    fontSize: "12px",
    ...extra,
  });

  return (
    <>
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-area { width: 100% !important; box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div style={{ width: "100%", margin: "0" }}>

        {/* ── Top Action Bar ── */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button type="button" onClick={() => navigate(-1)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              <FiArrowLeft size={15} /> Back
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0b1324" }}>Challan {challan.challanNo}</h1>
              <p style={{ margin: 0, fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>{formatDate(challan.challanDate)} · {customer.company_name}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" 
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "1.5px solid #e0e7ff", borderRadius: "8px", background: "#eef2ff", fontSize: "13px", fontWeight: 700, color: "#3730a3", cursor: "pointer" }}>
              <FiDownload size={15} /> Download PDF
            </button>
            <button type="button" 
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 700, color: "#374151", cursor: "pointer" }}>
              <FiPrinter size={15} /> Print
            </button>
            <button type="button" 
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "none", borderRadius: "8px", background: "#1e3a5f", fontSize: "13px", fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              <FiShare2 size={15} /> Share
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            CHALLAN DOCUMENT
        ══════════════════════════════════════════════════════════════ */}
        <div className="print-area" style={{
          background: "#fff",
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
          fontFamily: "Arial, sans-serif",
        }}>

          {/* ── HEADER ── */}
          <div style={{ background: "#fff", padding: "20px 28px", borderBottom: "3px solid #1e3a5f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img src={Logo} alt="Logo" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px" }} />
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#1e3a5f", letterSpacing: "0.5px" }}>{businessInfo.name}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", maxWidth: "380px", lineHeight: "1.3", marginTop: "2px" }}>{businessInfo.address}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>State Code: <strong>{businessInfo.state_code}</strong></div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{businessInfo.email} | {businessInfo.phone}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>GSTIN/UIN</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#1e3a5f", fontFamily: "monospace", letterSpacing: "1px" }}>{businessInfo.gst}</div>
              </div>
            </div>
          </div>

          {/* ── TITLE BAR ── */}
          <div style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", padding: "9px 28px", textAlign: "center" }}>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#111827", letterSpacing: "1px", textTransform: "uppercase" }}>
              Delivery Challan
            </span>
          </div>

          {/* ── BILLING / SHIPPING / CHALLAN META ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1.5px solid #d1d5db" }}>

            {/* Billing Address */}
            <div style={{ padding: "16px 18px", borderRight: "1px solid #d1d5db" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "5px", borderBottom: "1.5px solid #e5e7eb" }}>
                Billing Address
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0b1324", marginBottom: "4px" }}>{customer.company_name}</div>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
                {customer.address_line1}
                {customer.address_line2 && <>, {customer.address_line2}</>}
                <br />{customer.city}, {customer.state}, India
                <br />Pincode: {customer.pincode}
                <div style={{ fontSize: "11.5px", color: "#374151", marginTop: "2px" }}>
                  State Code: <strong>{customer.state_code}</strong>
                </div>
              </div>
              {customer.gstin && <div style={{ fontSize: "11.5px", color: "#374151", marginTop: "4px", marginBottom: "2px" }}>GSTIN: <strong>{customer.gstin}</strong></div>}
              {customer.pan && <div style={{ fontSize: "11.5px", color: "#374151", marginBottom: "4px" }}>PAN: <strong>{customer.pan}</strong></div>}
              {customer.phone && <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>Mo: +91-{customer.phone}</div>}
              {customer.email && <div style={{ fontSize: "12px", color: "#4b5563" }}>{customer.email}</div>}
            </div>

            {/* Shipping Address */}
            <div style={{ padding: "16px 18px", borderRight: "1px solid #d1d5db" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "5px", borderBottom: "1.5px solid #e5e7eb" }}>
                Shipping Address
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0b1324", marginBottom: "4px" }}>{shipping.company_name}</div>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
                {shipping.address_line1}
                {shipping.address_line2 && <>, {shipping.address_line2}</>}
                <br />{shipping.city}, {shipping.state}, India
                <br />Pincode: {shipping.pincode}
              </div>
              {shipping.state_code && (
                <div style={{ fontSize: "11.5px", color: "#374151", marginTop: "4px" }}>
                  State Code: <strong>{shipping.state_code}</strong>
                </div>
              )}
            </div>

            {/* Challan Details */}
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "5px", borderBottom: "1.5px solid #e5e7eb" }}>
                Challan Details
              </div>
              <MetaRow label="Challan No." value={challan.challanNo} />
              <MetaRow label="Challan Date" value={formatDate(challan.challanDate)} />
              <MetaRow label="Against Invoice" value={challan.againstInvoiceNo} />
              <MetaRow label="Invoice Date" value={formatDate(challan.invoiceDate)} />
              <MetaRow label="Place of Supply" value={`${challan.placeOfSupply} (${challan.placeOfSupplyCode})`} />
              <MetaRow label="Transport Mode" value={challan.transportMode} />
              <MetaRow label="Vehicle No." value={challan.vehicleNo} />
            </div>
          </div>

          {/* ── ITEMS TABLE ── */}
          <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                 {["#", "Description", "HSN/SAC", "Unit", "Qty"].map((h, i) => (
                    <th key={h} style={{
                      padding: "9px 8px",
                      textAlign: i >= 5 ? "right" : "left",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#374151",
                      letterSpacing: "0.04em",
                      borderRight: i < 5 ? "1px solid #e5e7eb" : "none",
                      borderBottom: "2px solid #d1d5db",
                      whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ ...cell(), textAlign: "center", color: "#6b7280", width: "28px" }}>{i + 1}</td>
                    <td style={{ ...cell(), fontWeight: 500, color: "#111827" }}>{item.description}</td>
         
                    <td style={{ ...cell(), color: "#6b7280", fontFamily: "monospace", fontSize: "11px" }}>{item.hsn || "—"}</td>
                    <td style={{ ...cell() }}>{item.unit}</td>
                    <td style={{ ...cell({ borderRight: "none" }),  fontWeight: 700, color: "#1e3a5f" }}>{item.qty}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr style={{ background: "#f0f4f8", borderBottom: "1.5px solid #d1d5db", borderTop: "1.5px solid #d1d5db" }}>
                  <td colSpan={4} style={{ ...cell(), fontWeight: 800, fontSize: "12px", color: "#374151" }}>Total :</td>
                  <td style={{ ...cell({ borderRight: "none" }), fontWeight: 800, color: "#1e3a5f" }}>{totalQty}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── NOTE ── */}
          <div style={{ borderTop: "1.5px solid #e5e7eb", padding: "9px 24px", background: "#fefce8", borderBottom: "1.5px solid #fef08a" }}>
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#713f12" }}>Note: </span>
            <span style={{ fontSize: "11.5px", color: "#713f12" }}>
              This is a Delivery Challan only. No tax invoice is raised against this document. Goods are dispatched for delivery/job work purposes only.
            </span>
          </div>

          {/* ── TERMS + SIGNATURES ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", borderTop: "1.5px solid #d1d5db" }}>

            {/* Terms + Receiver Signature */}
            <div style={{ padding: "16px 24px", borderRight: "1.5px solid #d1d5db" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Terms & Conditions
              </div>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                {challan.termsAndConditions}
              </div>

              <div style={{ marginTop: "28px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Receiver's Signature
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                  {["Name", "Date", "Stamp"].map((label) => (
                    <div key={label}>
                      <div style={{ height: "42px", borderBottom: "1px solid #d1d5db" }} />
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "5px" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Authorised Signatory */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  For {businessInfo.name}
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>GSTIN: {businessInfo.gst}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ height: "60px", borderBottom: "1px solid #d1d5db", marginBottom: "6px" }} />
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Authorised Signatory</div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ background: "#f8fafc", borderTop: "1.5px solid #e5e7eb", padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>This is a computer generated delivery challan.</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Page 1 of 1</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>E.O.E.</span>
          </div>

        </div>
        {/* END CHALLAN DOCUMENT */}

        {/* Bottom action bar */}
        {/* <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "20px", paddingBottom: "40px" }}>
          <button type="button"
            style={{ padding: "11px 28px", border: "1.5px solid #d1d5db", borderRadius: "8px", background: "#fff", fontSize: "13.5px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            ✏️ Edit Challan
          </button>
        </div> */}

      </div>
    </>
  );
}