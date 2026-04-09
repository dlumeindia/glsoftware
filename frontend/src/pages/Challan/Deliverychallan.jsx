import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiPrinter, FiShare2, FiArrowLeft, FiDownload } from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../context/AuthContext";



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
   const [profile, setProfile] = useState();
   const { user } = useAuth();  
   const [invoice, setInvoice] = useState({});
  const [customer, setCustomer] = useState({});
  const [items, setItems] = useState([]);
  const [challan, setChallan] = useState({});


  const totalQty = items.reduce((s, i) => s + i.qty, 0);

   useEffect(() => {
      if (id) {
        const numericId = Number(id);
        window.electronAPI.getInvoiceById(numericId).then((res) => {
          if (res.success) {
          setInvoice(res.data);       
          setCustomer(res.data.customer); 
          setItems(res.data.items);   
          setChallan(res.data.delivery);   
        }
        });
      }
    }, [id]);

    useEffect(() => {
      const loadProfile = async () => {
        const data = await window.electronAPI.getProfile(user.id);
        if (data) {
          setProfile(data);
        }
      };
      loadProfile();
  
    }, []);

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".print-area");

    if (!element) return;

      const html = `
        <html>
          <head>
            <style>
              body { margin:0; font-family: Arial; }
              @page { size: A4; margin: 10mm; }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `;

    await window.electronAPI.generatePDF( {fileext: 'Challan',
      html: html,});
    //  const res = await window.electronAPI.downloadPDF();
  };

  const handlePrint = async () => {
    const element = document.querySelector(".print-area");

      if (!element) return;

        const html = `
          <html>
            <head>
              <style>
                body { margin:0; font-family: Arial; }
                @page { size: A4; margin: 10mm; }
              </style>
            </head>
            <body>
              ${element.outerHTML}
            </body>
          </html>
        `;

      await window.electronAPI.printPDF(html);
  };

    const handleShare = async () => {
      try {
        const element = document.querySelector(".print-area");

        if (!element) return;

          const html = `
            <html>
              <head>
                <style>
                  body { margin:0; font-family: Arial; }
                  @page { size: A4; margin: 10mm; }
                </style>
              </head>
              <body>
                ${element.outerHTML}
              </body>
            </html>
          `;

        const res = await window.electronAPI.generateAutoPDF( {fileext: 'Invoice',
          html: html,});

        if (res?.success) {
          await window.electronAPI.sharePDF(res.filePath);
        }
      } catch (err) {
        console.log( err);
      }
    };


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
            <button type="button" onClick={handleDownloadPDF}
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "1.5px solid #e0e7ff", borderRadius: "8px", background: "#eef2ff", fontSize: "13px", fontWeight: 700, color: "#3730a3", cursor: "pointer" }}>
              <FiDownload size={15} /> Download PDF
            </button>
            <button type="button" onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 700, color: "#374151", cursor: "pointer" }}>
              <FiPrinter size={15} /> Print
            </button>
            <button type="button" onClick={handleShare}
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
                  <img
                    src={profile?.header_image}
                    alt="Logo"
                    style={{
                      width: "60px",
                      height: "auto",
                      maxHeight: "60px",
                      objectFit: "contain"
                    }}
                  />              <div>
                  <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.5px", marginBottom: "4px" }}>{profile?.business_name}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "420px", lineHeight: "1.5" }}>{profile?.address_line1}, {profile?.address_line2}, {profile?.city} - {profile?.pincode}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "420px", lineHeight: "1.5" }}>customer state Code : {profile?.state_code}</div>
                  <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "4px" }}>{profile?.email} · {profile?.phone}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "2px", letterSpacing: "0.05em" }}>GSTIN</div>
            <div style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px" }}>{profile?.gstin}</div>
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
              <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0b1324", marginBottom: "4px" }}>{invoice.ship_company_name}</div>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
                {invoice.ship_address_line1}
                {invoice.ship_address_line2 && <>, {invoice.ship_address_line2}</>}
                <br />{invoice.ship_city}, {invoice.ship_state}, India
                <br />Pincode: {invoice.ship_pincode}
              </div>
              {invoice.ship_state_code && (
                <div style={{ fontSize: "11.5px", color: "#374151", marginTop: "4px" }}>
                  State Code: <strong>{invoice.ship_state_code}</strong>
                </div>
              )}
            </div>

            {/* Challan Details */}
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "5px", borderBottom: "1.5px solid #e5e7eb" }}>
                Challan Details
              </div>
              <MetaRow label="Challan No." value={challan.challan_no} />
              <MetaRow label="Challan Date" value={formatDate(challan.challan_date)} />
              <MetaRow label="Against Invoice" value={challan.against_invoice_no} />
              <MetaRow label="Invoice Date" value={formatDate(challan.invoice_date)} />
              <MetaRow label="Place of Supply" value={`${challan.place_of_supply} (${challan.place_of_supply_code})`} />
              <MetaRow label="Transport Mode" value={challan.transport_mode} />
              <MetaRow label="Vehicle No." value={challan.vehicle_no} />
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
                 {profile?.terms || "1. Payment due within 30 days.\n2. Goods once sold will not be taken back.\n3. Subject to Navi Mumbai Jurisdiction."}
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
                  For {profile?.business_name}
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>GSTIN: {profile?.gstin}</div>
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