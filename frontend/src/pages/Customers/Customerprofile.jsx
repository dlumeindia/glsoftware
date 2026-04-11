import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect } from "react";
import { useContext } from "react";
import { PageTitleContext } from "../../layout/MainLayout"; 
import toast from "react-hot-toast";


const indianStates = [
  { code: "01", name: "Jammu & Kashmir" }, { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" }, { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" }, { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" }, { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" }, { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" }, { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" }, { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" }, { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" }, { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" }, { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" }, { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" }, { code: "24", name: "Gujarat" },
  { code: "27", name: "Maharashtra" }, { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" }, { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" }, { code: "34", name: "Puducherry" },
  { code: "36", name: "Telangana" }, { code: "37", name: "Andhra Pradesh" },
];

const businessTypes = ["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited", "OPC", "Trust", "HUF", "Other"];

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "13.5px",
  color: "#111827",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const validateGST = (v) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
const validatePAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
const validateEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validatePhone = (v) => !v || /^[6-9][0-9]{9}$/.test(v);
const validatePincode = (v) => !v || /^[1-9][0-9]{5}$/.test(v);

const fmtPhone = (p) => p && p.length === 10 ? `+91 ${p.slice(0, 5)} ${p.slice(5)}` : p || "—";
const getInitials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);



function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em",
        color: "#111827", textTransform: "uppercase", display: "block", marginBottom: "5px",
      }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", readOnly }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      style={{ ...inputStyle, cursor: readOnly ? "not-allowed" : "text" }}
      onFocus={(e) => { if (!readOnly) e.target.style.borderColor = "#3b82f6"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange} style={{
      ...inputStyle, appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    }}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", overflow: "hidden", marginBottom: "20px" }}>
      <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "15px" }}>{icon}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#374151", textTransform: "uppercase" }}>{title}</span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function CharBoxInput({ value, onChange, length, numericOnly = false }) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {Array.from({ length }).map((_, index) => (
        <input key={index} maxLength={1} value={value[index] || ""}
          onChange={(e) => {
            const raw = numericOnly ? e.target.value.replace(/[^0-9]/g, "") : e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            const newVal = value.substring(0, index) + raw + value.substring(index + 1);
            onChange(newVal);
            if (raw && e.target.nextSibling) e.target.nextSibling.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[index] && e.target.previousSibling) e.target.previousSibling.focus();
            if (e.key === "ArrowLeft" && e.target.previousSibling) { e.preventDefault(); e.target.previousSibling.focus(); }
            if (e.key === "ArrowRight" && e.target.nextSibling) { e.preventDefault(); e.target.nextSibling.focus(); }
          }}
          style={{ width: "32px", height: "36px", textAlign: "center", fontSize: "14px", fontWeight: 600, border: "1.5px solid #d1d5db", borderRadius: "6px", outline: "none", background: "#fff", color: "#111827" }}
          onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; }}
          onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
        />
      ))}
    </div>
  );
}

function ErrorMsg({ field, errors }) {
  if (!errors[field]) return null;
  return <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors[field]}</span>;
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{
        width: "180px", flexShrink: 0,
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em",
        color: "#6b7280", textTransform: "uppercase",
      }}>
        {label}
      </span>

      <span style={{
        fontSize: "13.5px",
        color: value ? "#111827" : "#9ca3af",
        fontWeight: 500,
        fontFamily: mono ? "monospace" : "inherit",
        letterSpacing: mono ? "0.06em" : "normal",
        lineHeight: "1.4",
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

function ProfileView({ c, onEdit, onBack }) {

const billingAddress = [
  c.customer_address_line1,
  c.customer_address_line2,
  c.customer_city,
  c.customer_state,
  c.customer_pincode
].filter(Boolean).join(", ");

const shippingAddress = c.same_as_billing
  ? billingAddress
  : [
      c.shipping_address_line1,
      c.shipping_address_line2,
      c.shipping_city,
      c.shipping_state,
      c.shipping_pincode
    ].filter(Boolean).join(", ");

  const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" };

  return (
    <div style={{ width: "100%", margin: "0" }}>

      {/* Header — matches InvoiceDetail top action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Back Button — identical to InvoiceDetail */}
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <FiArrowLeft size={15} /> Back
          </button>

        

      
        </div>

        <button onClick={onEdit} style={{ padding: "11px 28px", border: "none", borderRadius: "8px", background: "#1e3a5f", fontSize: "13.5px", fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.3px" }}>
          Edit Customer
        </button>
      </div>

      {/* Basic Info + Tax & Identity — side by side */}
      <div style={row2}>
        <Section title="Basic Information" icon="🏢">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row label="Customer Name" value={c.customer_name} />
            <Row label="Company Name" value={c.company_name} />
          
            <Row label="Business Type" value={c.business_type} />
          </div>
        </Section>

        <Section title="Tax & Identity" icon="📋">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row label="GSTIN" value={c.customer_gstin || "—"} mono />
            <Row label="PAN" value={c.customer_pan || "—"} mono />
          </div>
        </Section>
      </div>

      {/* Contact Details */}
      <Section title="Contact Details" icon="📞">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Row label="Mobile Number" value={fmtPhone(c.customer_phone)} />
          {c.customer_alt_phone && <Row label="Alternate Mobile" value={fmtPhone(c.customer_alt_phone)} />}
          <Row label="Email Address" value={c.customer_email} />
          <Row label="Website" value={c.customer_website} />
        </div>
      </Section>

      {/* Billing + Shipping — side by side */}
      <div style={row2}>
      <Section title="Billing Address" icon="📍">
  <Row label="Full Address" value={billingAddress} />
</Section>

     <Section title="Shipping Address" icon="🚚">
  <Row label="Full Address" value={shippingAddress} />
</Section>
      </div>

    </div>
  );
}

function EditForm({ customer, onSave, onCancel }) {
  const [form, setForm] = useState({ ...customer });
  const [errors, setErrors] = useState({});

  const update = (field, val) => {
    if (field === "customer_state") {
      const st = indianStates.find((s) => s.name === val);
      setForm((f) => ({ ...f, customer_state: val, customer_state_code: st ? st.code : f.customer_state_code }));
    } else if (field === "shipping_state") {
      const st = indianStates.find((s) => s.name === val);
      setForm((f) => ({ ...f, shipping_state: val, shipping_state_code: st ? st.code : f.shipping_state_code }));
    } else {
      setForm((f) => ({ ...f, [field]: val }));
    }
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = "Customer name is required";
    if (form.customer_gstin.length === 15 && !validateGST(form.customer_gstin)) e.customer_gstin = "Invalid GSTIN format";
    if (form.customer_pan.length === 10 && !validatePAN(form.customer_pan)) e.customer_pan = "Invalid PAN format";
    if (!validatePhone(form.customer_phone)) e.customer_phone = "Invalid mobile number";
    if (!validateEmail(form.customer_email)) e.customer_email = "Invalid email address";
    if (!form.customer_address_line1.trim()) e.customer_address_line1 = "Address is required";
    if (!form.customer_city.trim()) e.customer_city = "City is required";
    if (!form.customer_state) e.customer_state = "State is required";
    if (!validatePincode(form.customer_pincode)) e.customer_pincode = "Invalid pincode";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

  return (
    <div style={{ width: "100%", margin: "0" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0b1324", letterSpacing: "-0.3px" }}>Edit Customer</h1>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>Update customer record</p>
        </div>
      </div>

      <Section title="Basic Information" icon="🏢">
        <div style={grid2}>
          <Field label="Customer Name" required>
            <TextInput value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} placeholder="Rahul Sharma" />
            <ErrorMsg field="customer_name" errors={errors} />
          </Field>
          <Field label="Company Name">
            <TextInput value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="ABC Industries Pvt Ltd" />
          </Field>
       
          <Field label="Business Type">
            <SelectInput value={form.business_type} onChange={(e) => update("business_type", e.target.value)} placeholder="Select Business Type" options={businessTypes.map((t) => ({ value: t, label: t }))} />
          </Field>
        </div>
      </Section>

      <Section title="Tax & Identity" icon="📋">
        <div style={grid2}>
          <Field label="GSTIN">
            <CharBoxInput value={form.customer_gstin} onChange={(v) => update("customer_gstin", v)} length={15} />
            {form.customer_gstin.length === 15 && (
              <button type="button" onClick={() => update("customer_pan", form.customer_gstin.substring(2, 12))}
                style={{ marginTop: "6px", background: "none", border: "none", color: "#3b82f6", fontSize: "11.5px", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                Auto-fill PAN from GSTIN
              </button>
            )}
            <ErrorMsg field="customer_gstin" errors={errors} />
          </Field>
          <Field label="PAN">
            <CharBoxInput value={form.customer_pan} onChange={(v) => update("customer_pan", v)} length={10} />
            <ErrorMsg field="customer_pan" errors={errors} />
          </Field>
        </div>
      </Section>

      <Section title="Contact Details" icon="📞">
        <div style={grid2}>
          <Field label="Mobile Number" required>
            <CharBoxInput value={form.customer_phone} onChange={(v) => update("customer_phone", v)} length={10} numericOnly />
            <ErrorMsg field="customer_phone" errors={errors} />
          </Field>
          <Field label="Alternate Mobile">
            <CharBoxInput value={form.customer_alt_phone} onChange={(v) => update("customer_alt_phone", v)} length={10} numericOnly />
          </Field>
          <Field label="Email Address">
            <TextInput type="email" value={form.customer_email} onChange={(e) => update("customer_email", e.target.value)} placeholder="billing@company.com" />
            <ErrorMsg field="customer_email" errors={errors} />
          </Field>
          <Field label="Website">
            <TextInput value={form.customer_website} onChange={(e) => update("customer_website", e.target.value)} placeholder="https://www.company.com" />
          </Field>
        </div>
      </Section>

      <Section title="Billing Address" icon="📍">
        <div style={grid2}>
          <Field label="Address Line 1" required>
            <TextInput value={form.customer_address_line1} onChange={(e) => update("customer_address_line1", e.target.value)} placeholder="Building, Street, Area" />
            <ErrorMsg field="customer_address_line1" errors={errors} />
          </Field>
          <Field label="Address Line 2">
            <TextInput value={form.customer_address_line2} onChange={(e) => update("customer_address_line2", e.target.value)} placeholder="Landmark (optional)" />
          </Field>
          <Field label="City" required>
            <TextInput value={form.customer_city} onChange={(e) => update("customer_city", e.target.value)} placeholder="Mumbai" />
            <ErrorMsg field="customer_city" errors={errors} />
          </Field>
          <Field label="State" required>
            <SelectInput value={form.customer_state} onChange={(e) => update("customer_state", e.target.value)} placeholder="Select State" options={indianStates.map((s) => ({ value: s.name, label: s.name }))} />
            <ErrorMsg field="customer_state" errors={errors} />
          </Field>
          <Field label="State Code">
            <TextInput value={form.customer_state_code} readOnly onChange={() => {}} placeholder="27" />
          </Field>
          <Field label="Pincode" required>
            <TextInput value={form.customer_pincode} onChange={(e) => update("customer_pincode", e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="400001" />
            <ErrorMsg field="customer_pincode" errors={errors} />
          </Field>
        </div>
      </Section>

      <Section title="Shipping Address" icon="🚚">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1.5px dashed #e5e7eb" }}>
          <div onClick={() => update("same_as_billing", !form.same_as_billing)}
            style={{ width: "18px", height: "18px", border: `2px solid ${form.same_as_billing ? "#1e3a5f" : "#d1d5db"}`, borderRadius: "4px", background: form.same_as_billing ? "#1e3a5f" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {form.same_as_billing && <span style={{ color: "#fff", fontSize: "11px", fontWeight: 800 }}>✓</span>}
          </div>
          <span onClick={() => update("same_as_billing", !form.same_as_billing)} style={{ fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            Same as Billing Address
          </span>
        </div>
        {form.same_as_billing ? (
          <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#0369a1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>ℹ️</span><span>Shipping address will be the same as billing address.</span>
          </div>
        ) : (
          <div style={grid2}>
            <Field label="Address Line 1"><TextInput value={form.shipping_address_line1} onChange={(e) => update("shipping_address_line1", e.target.value)} placeholder="Building, Street, Area" /></Field>
            <Field label="Address Line 2"><TextInput value={form.shipping_address_line2} onChange={(e) => update("shipping_address_line2", e.target.value)} placeholder="Landmark (optional)" /></Field>
            <Field label="City"><TextInput value={form.shipping_city} onChange={(e) => update("shipping_city", e.target.value)} placeholder="Mumbai" /></Field>
            <Field label="State"><SelectInput value={form.shipping_state} onChange={(e) => update("shipping_state", e.target.value)} placeholder="Select State" options={indianStates.map((s) => ({ value: s.name, label: s.name }))} /></Field>
            <Field label="State Code"><TextInput value={form.shipping_state_code} readOnly onChange={() => {}} placeholder="27" /></Field>
            <Field label="Pincode"><TextInput value={form.shipping_pincode} onChange={(e) => update("shipping_pincode", e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="400001" /></Field>
          </div>
        )}
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingBottom: "40px" }}>
        <button type="button" onClick={onCancel}
          style={{ padding: "11px 28px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#f8fafc", fontSize: "13.5px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
          Cancel
        </button>
        <button type="button" onClick={handleSave}
          style={{ padding: "11px 28px", border: "none", borderRadius: "8px", background: "#1e3a5f", fontSize: "13.5px", fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.3px" }}>
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}



export default function CustomerProfile() {
  const setTitle = useContext(PageTitleContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("profile");
  const [customer, setCustomer] = useState(null);
  console.log("CustomerProfile rendered");

  useEffect(() => {
    console.log("check");
    const fetchCustomer = async () => {
      const res = await window.electronAPI.getCustomerById(id);

      if (res.success) {
        setCustomer(res.data);
      } else {
        console.error(res.error);
      }
    };

    fetchCustomer();
  }, [id]);

useEffect(() => {
  const fetchCustomer = async () => {
    const res = await window.electronAPI.getCustomerById(id);

    if (res.success) {
      setCustomer(res.data);

      // 🔥 SET TOPBAR HERE
      setTitle({
        title: res.data.customer_name,
        subtitle: res.data.company_name || "Customer Details",
      });

    } else {
      console.error(res.error);
    }
  };

  fetchCustomer();
}, [id]);


const handleSave = async (updated) => {
  try {
    const res = await window.electronAPI.updateCustomer(updated);

    if (res.success) {
      setCustomer(updated);
      setMode("profile");

      toast.success("Customer updated successfully!");
      navigate("/customer-list");

    } else {
      toast.error("Failed to update customer. Please try again.");
    }
  } catch (err) {
    console.error("Save error:", err);
    toast.error("❌ Something went wrong");
  }
};

  if (!customer) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%" }}>
    
      {mode === "profile"
        ? <ProfileView c={customer} onEdit={() => setMode("edit")} onBack={() => navigate(-1)} />
        : <EditForm customer={customer} onSave={handleSave} onCancel={() => setMode("profile")} />
      }
    </div>
  );
}