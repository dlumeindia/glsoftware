import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import CustomerModal from "../../components/CustomerModal";


const indiancustomer_states = [
  { code: "01", name: "Jammu & Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
];

const businessInfo = {
  name: "GLS TECHNOLOGIST",
  address: "Plot No. PAP-A-78, TTC Industrial Area, Pawane MIDC, Turbhe, Navi Mumbai,Maharashtra - 400709",
  customer_state_code: "27",
  customer_email: "glstechnologist2020@gmail.com",
  gst: "27AAUFG7297B1ZV",
  customer_phone: "+91 98765 43210",
  bank: "ICICI BANK",
  branch: "Airoli, Navi Mumbai",
  account: "109005002301",
  ifsc: "ICIC0001090",
  accountHolder: "GLS TECHNOLOGIST",
};

const gstOptions = [0, 5, 12, 18, 28];
const InvoiceTypeOptions = ["Tax Invoice", "Debit Note", "Credit Note"];

const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  return convert(Math.round(num));
};

const getFieldRules = (customerType) => ({
  company_name: true,
  customer_phone: true,
  customer_address_line1: true,
  customer_city: true,
  customer_state: true,
  customer_pincode: true,
  customer_gstin: customerType === "B2B",
  customer_email: customerType === "B2B",
});

const Field = ({ label, required, children, className = "", hint }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#111827", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
      {label}
      {required && <span style={{ color: "#ef4444" }}>*</span>}
      {!required && hint && (
        <span style={{ color: "#9ca3af", fontSize: "10px", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>({hint})</span>
      )}
    </label>
    {children}
  </div>
);

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

const TextInput = ({ value, onChange, type = "text", readOnly }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    style={{ ...inputStyle, background: "#ffffff", cursor: readOnly ? "not-allowed" : "text" }}
    onFocus={(e) => !readOnly && (e.target.style.borderColor = "#3b82f6")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  />
);

const SelectInput = ({ value, onChange, options,  }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      ...inputStyle,
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
    }}
  >
    <option value=""></option>
    {options.map((o) => (
      <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
    ))}
  </select>
);

const Section = ({ title, icon, children }) => (
  <div style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", overflow: "hidden", marginBottom: "20px" }}>
    <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "15px" }}>{icon}</span>
      <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#374151", textTransform: "uppercase" }}>{title}</span>
    </div>
    <div style={{ padding: "20px" }}>{children}</div>
  </div>
);

const OtpInput = ({ value, onChange, length, numbersOnly = false }) => (
  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
    {Array.from({ length }).map((_, index) => (
      <input
        key={index}
        maxLength={1}
        value={value[index] || ""}
        onChange={(e) => {
          const raw = numbersOnly
            ? e.target.value.replace(/[^0-9]/g, "")
            : e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
          const newVal = value.substring(0, index) + raw + value.substring(index + 1);
          onChange(newVal);
          if (raw && e.target.nextSibling) e.target.nextSibling.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !value[index] && e.target.previousSibling) e.target.previousSibling.focus();
          if (e.key === "ArrowLeft" && e.target.previousSibling) { e.preventDefault(); e.target.previousSibling.focus(); }
          if (e.key === "ArrowRight" && e.target.nextSibling) { e.preventDefault(); e.target.nextSibling.focus(); }
        }}
        style={{ width: "32px", height: "36px", textAlign: "center", fontSize: "14px", fontWeight: 600, border: "1.5px solid #d1d5db", borderRadius: "6px", outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
      />
    ))}
  </div>
);

const emptyAddress = {
  company_name: "", customer_gstin: "",  customer_address_line1: "", customer_address_line2: "",
  customer_city: "", customer_state: "", customer_state_code: "", customer_pincode: "", customer_email: "", customer_phone: "",
  place_of_supply: "", place_of_supply_code: "",
};

const AddressForm = ({ form, update, title, customerType, fieldRules }) => (
  <div>
    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a5f", marginBottom: "14px", paddingBottom: "8px", borderBottom: "1.5px solid #f0f4f8" }}>
      {title}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
      <Field label={customerType === "B2B" ? "Company / Name" : "Company Name"} required={fieldRules.company_name}>
        <TextInput value={form.company_name} onChange={(e) => update("company_name", e.target.value)}/>
      </Field>
      <Field label="Email" required={fieldRules.customer_email} hint={!fieldRules.customer_email ? "optional" : undefined}>
        <TextInput type="email" value={form.customer_email} onChange={(e) => update("customer_email", e.target.value)} placeholder="billing@company.com" />
      </Field>
      <Field label="Mobile Number" required={fieldRules.customer_phone}>
        <OtpInput value={form.customer_phone || ""} onChange={(v) => update("customer_phone", v)} length={10} numbersOnly />
      </Field>
      {customerType === "B2B" ? (
        <Field label="GSTIN" required={fieldRules.customer_gstin}>
          <OtpInput value={form.customer_gstin || ""} onChange={(v) => update("customer_gstin", v)} length={15} />
        </Field>
      ) : (
        <Field label="GSTIN" >
          <OtpInput value={form.customer_gstin || ""} onChange={(v) => update("customer_gstin", v)} length={15} />
        </Field>
      )}
     
      <Field label="Address Line 1" required={fieldRules.customer_address_line1}>
        <TextInput value={form.customer_address_line1} onChange={(e) => update("customer_address_line1", e.target.value)} placeholder="Building, Street, Area" />
      </Field>
      <Field label="Address Line 2" hint="optional">
        <TextInput value={form.customer_address_line2} onChange={(e) => update("customer_address_line2", e.target.value)} placeholder="Landmark (optional)" />
      </Field>
      <Field label="City" required={fieldRules.customer_city}>
        <TextInput value={form.customer_city} onChange={(e) => update("customer_city", e.target.value)} placeholder="Mumbai" />
      </Field>
      <Field label="State" required={fieldRules.customer_state}>
        <SelectInput value={form.customer_state} onChange={(e) => update("customer_state", e.target.value)} placeholder="Select customer_state" options={indiancustomer_states.map((s) => ({ value: s.name, label: s.name }))} />
      </Field>
      <Field label="State Code">
        <TextInput value={form.customer_state_code} onChange={(e) => update("customer_state_code", e.target.value)} placeholder="27" readOnly={!!form.customer_state} />
      </Field>
      <Field label="Pincode" required={fieldRules.customer_pincode}>
        <TextInput value={form.customer_pincode} onChange={(e) => update("customer_pincode", e.target.value)} placeholder="400001" />
      </Field>
      <div />
    </div>
  </div>
);

export default function CreateInvoice() {
   const [profile, setProfile] = useState();
   const { user } = useAuth();  
  const [customers, setCustomers] =useState([]);
  const [invoiceNo, setInvoiceNo] =useState("");
  const [invoiceDate, setInvoiceDate] =useState(new Date().toISOString().split("T")[0]);
  const [supplyType, setSupplyType] =useState("Outward");
  const [revCharge, setRevCharge] =useState("no");
  const [paymentTerms, setPaymentTerms] =useState("Tax Invoice");

  // Customer type — auto-derived from GSTIN
  const [customerType, setCustomerType] =useState("B2C");
  const fieldRules = getFieldRules(customerType);

  const [ewayEnabled, setEwayEnabled] =useState(false);
  const [docType, setDocType] =useState("");
  const [subSupplyType, setSubSupplyType] =useState("Supply");
  const [transporterName, setTransporterName] =useState("");
  const [transporterDocNo, setTransporterDocNo] =useState("");
  const [vehicleNo, setVehicleNo] =useState("");
  const [from, setFrom] =useState("");
  const [deliveryMode, setDeliveryMode] =useState("1");
  const [approximateDistance, setApproximateDistance] =useState("");
const [customerModal, setCustomerModal] = useState(false);
  // const [customers] =useState([
  //   { id: 1, company_name: "ABC Industries Pvt Ltd", gstin: "27ABCDE1234F1Z5", customer_address_line1: "101 Industrial Zone", customer_address_line2: "", customer_city: "Mumbai", customer_state: "Maharashtra", customer_state_code: "27", customer_pincode: "400001", customer_email: "abc@example.com", customer_phone: "9876543210", customer_pan: "ABCDE1234F", place_of_supply: "Maharashtra", place_of_supply_code: "27" },
  //   { id: 2, company_name: "XYZ Traders", gstin: "27PQRSX5678L1Z2", customer_address_line1: "45 Trade Center", customer_address_line2: "Sector 5", customer_city: "Pune", customer_state: "Maharashtra", customer_state_code: "27", customer_pincode: "411001", customer_email: "xyz@traders.com", customer_phone: "9123456789", customer_pan: "", place_of_supply: "Maharashtra", place_of_supply_code: "27" },
  // ]);
  const [selectedCustomer, setSelectedCustomer] =useState(null);
  const [customerID, setCustomerID] =useState(null);
  const [showCustDropdown, setShowCustDropdown] =useState(false);
  const [custSearch, setCustSearch] =useState("");
  const [billForm, setBillForm] =useState({ ...emptyAddress });
  const [shipForm, setShipForm] =useState({ ...emptyAddress });
  const [sameAsBilling, setSameAsBilling] =useState(false);

   useEffect(() => {
      loadCustomers();
    }, []);
  
    const loadCustomers = async () => {
      const res = await window.electronAPI.getCustomers();
      console.log(res);
  
      if (res.success) {
        setCustomers(res.data);
      } else {
        console.error(res.error);
      }
    };

     useEffect(() => {
      const loadProfile = async () => {
        const data = await window.electronAPI.getProfile(user.id);
        if (data) {
          setProfile(data);
        }
      };
      loadProfile();
  
    }, []);

  const filteredCusts = customers.filter((c) =>
    c.company_name.toLowerCase().includes(custSearch.toLowerCase())
  );

  const handleSaveInvoice = async () => {
  try {
    const data = {
      invoiceNo,
      invoiceDate,
      paymentTerms,
      supplyType,
      subSupplyType,
      revCharge,
      customerType,

      billForm,
      shipForm,
      sameAsBilling,

      items,

      subtotal,
      totalDiscount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      roundOff,
      grandTotal,

      ewayEnabled,
      docType,
      approximateDistance,
      transporterName,
      transporterDocNo,
      vehicleNo,
      deliveryMode,
      from,
      customerID,
    };

    console.log("📤 Sending to backend:", data);

    const res = await window.electronAPI.saveInvoice(data);

    if (res?.success) {
      alert(`✅ Invoice Saved (ID: ${res.invoiceId})`);
      
      // Optional: Reset form
      // resetForm();
    } else {
      alert("❌ Failed to save invoice");
    }

  } catch (error) {
    console.error("❌ Save Error:", error);
    alert("Something went wrong");
  }
};

  const selectCustomer = (c) => {
    setSelectedCustomer(c);
    setBillForm({ ...c });
    setCustomerType(c.customer_gstin && c.customer_gstin.trim().length === 15 ? "B2B" : "B2C");
    setCustomerID(c.id);
    if (sameAsBilling) setShipForm({ ...c });
    setShowCustDropdown(false);
  };

  const updateBillForm = (field, val) => {
    if (field === "customer_state") {
      const st = indiancustomer_states.find((s) => s.name === val);
      setBillForm((f) => ({ ...f, customer_state: val, customer_state_code: st ? st.code : f.customer_state_code }));
      if (sameAsBilling) setShipForm((f) => ({ ...f, customer_state: val, customer_state_code: st ? st.code : f.customer_state_code }));
    } else if (field === "place_of_supply") {
      const st = indiancustomer_states.find((s) => s.name === val);
      setBillForm((f) => ({ ...f, place_of_supply: val, place_of_supply_code: st ? st.code : f.place_of_supply_code }));
      if (sameAsBilling) setShipForm((f) => ({ ...f, place_of_supply: val, place_of_supply_code: st ? st.code : f.place_of_supply_code }));
    } else {
      if (field === "customer_gstin") setCustomerType(val.trim().length === 15 ? "B2B" : "B2C");
      setBillForm((f) => ({ ...f, [field]: val }));
      if (sameAsBilling) setShipForm((f) => ({ ...f, [field]: val }));
    }
  };

  const updateShipForm = (field, val) => {
    if (field === "customer_state") {
      const st = indiancustomer_states.find((s) => s.name === val);
      setShipForm((f) => ({ ...f, customer_state: val, customer_state_code: st ? st.code : f.customer_state_code }));
    } else if (field === "place_of_supply") {
      const st = indiancustomer_states.find((s) => s.name === val);
      setShipForm((f) => ({ ...f, place_of_supply: val, place_of_supply_code: st ? st.code : f.place_of_supply_code }));
    } else {
      setShipForm((f) => ({ ...f, [field]: val }));
    }
  };

  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    if (checked) setShipForm({ ...billForm });
  };

  const [items, setItems] =useState([
    { description: "", itemCode: "", hsn: "", qty: 1, rate: 0, discount: 0, unit: "NOS", gstRate: 18 },
  ]);
const updateItem = (i, field, value) => {
  setItems((prev) =>
    prev.map((item, index) =>
      index === i ? { ...item, [field]: value } : item
    )
  );
};
  const addItem = () => setItems([...items, { description: "", itemCode: "", hsn: "", qty: 1, rate: 0, discount: 0, unit: "NOS", gstRate: 18 }]);
  const removeItem = (i) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

const itemTaxable = (item) => {
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const discount = Number(item.discount) || 0;

  const gross = qty * rate;
  const discAmt = discount > 0 ? (gross * discount) / 100 : 0;

  return gross - discAmt;
};
const itemTax = (item) => {
  const gst = Number(item.gstRate) || 0;
  return (itemTaxable(item) * gst) / 100;
};
  const itemTotal = (item) => itemTaxable(item) + itemTax(item);

const subtotal = items.reduce((s, item) => {
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  return s + qty * rate;
}, 0);

const totalDiscount = items.reduce((s, item) => {
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const discount = Number(item.discount) || 0;
  return s + (qty * rate * discount) / 100;
}, 0);
  const taxableAmount = subtotal - totalDiscount;
  const grandTaxable = taxableAmount;
  const BUSINESS_customer_state_CODE = businessInfo.customer_state_code;
  const placeOfSupplyCode = sameAsBilling ? billForm.customer_state_code : shipForm.customer_state_code;
 const isInter = placeOfSupplyCode !== BUSINESS_customer_state_CODE;
  const totalItemTax = items.reduce((s, item) => s + itemTax(item), 0);
  const cgst = isInter ? 0 : totalItemTax / 2;
  const sgst = isInter ? 0 : totalItemTax / 2;
  const igst = isInter ? totalItemTax : 0;
  const grandBeforeRound = grandTaxable + cgst + sgst + igst;
  const grandTotal = Math.round(grandBeforeRound);
  const roundOff = grandTotal - grandBeforeRound;

  const taxSummary = items.reduce((acc, item) => {
    const key = item.hsn || "N/A";
    if (!acc[key]) acc[key] = { hsn: key, taxable: 0, cgstAmt: 0, sgstAmt: 0, igstAmt: 0, rate: item.gstRate };
    acc[key].taxable += itemTaxable(item);
    const tax = itemTax(item);
    if (isInter) acc[key].igstAmt += tax;
    else { acc[key].cgstAmt += tax / 2; acc[key].sgstAmt += tax / 2; }
    return acc;
  }, {});

  const units = ["NOS", "PCS", "KG", "MTR", "LTR", "SET", "BOX", "ROLL", "PAIR"];

  return (
    <div style={{ width: "100%", margin: "0" }}>
   

      {/* Company Banner */}
      <div style={{ background: "#1e3a5f", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.5px", marginBottom: "4px" }}>{profile?.business_name}</div>
            <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "420px", lineHeight: "1.5" }}>{profile?.address_line1}, {profile?.address_line2}, {profile?.city} - {profile?.pincode}</div>
            <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "420px", lineHeight: "1.5" }}>customer state Code : {profile?.state_code}</div>
            <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "4px" }}>{profile?.email} · {profile?.phone}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "2px", letterSpacing: "0.05em" }}>GSTIN</div>
            <div style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px" }}>{profile?.gstin}</div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <Section title="Invoice Details" icon="🧾">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <Field label="Invoice No" required>
            <TextInput value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="INV-2526-001" />
          </Field>
          <Field label="Invoice Date" required>
            <TextInput type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </Field>
          <Field label="Invoice Type">
            <SelectInput value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Select Type" options={InvoiceTypeOptions.map((p) => ({ value: p, label: p }))} />
          </Field>
          <Field label="Supply Type" required>
            <SelectInput value={supplyType} onChange={(e) => setSupplyType(e.target.value)} placeholder="Select" options={[{ value: "Outward", label: "Outward" }, { value: "Inward", label: "Inward" }]} />
          </Field>
          <Field label="Sub Supply Type" required>
            <SelectInput value={subSupplyType} onChange={(e) => setSubSupplyType(e.target.value)} placeholder="Select Type" options={[{ value: "Supply", label: "Supply" }, { value: "Import", label: "Import" }, { value: "Export", label: "Export" }, { value: "Job", label: "Job Work" }, { value: "For Own Use", label: "For Own Use" }, { value: "Job Work Returns", label: "Job Work Returns" }, { value: "Sales Return", label: "Sales Return" }, { value: "Others", label: "Others" }]} />
          </Field>
          <Field label="Reverse Charge">
            <SelectInput value={revCharge} onChange={(e) => setRevCharge(e.target.value)} options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
          </Field>
        </div>
      </Section>

      {/* Billing & Shipping */}
      <Section title="Billing & Shipping Address" icon="🏢">

        {/* Customer Search row + Customer Type side by side */}
        <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1.5px dashed #e5e7eb" }}>
       <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr", gap: "16px", alignItems: "end" }}>

            {/* Select Existing Customer */}
            <Field label="Select Existing Customer">
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setShowCustDropdown(!showCustDropdown)}
                  style={{ ...inputStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <span style={{ color: selectedCustomer ? "#111827" : "#9ca3af" }}>
                    {selectedCustomer ? selectedCustomer.company_name : "Search & select customer..."}
                  </span>
                  <span style={{ fontSize: "10px", color: "#6b7280" }}>▼</span>
                </div>
                {showCustDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden" }}>
                    <div style={{ padding: "10px" }}>
                      <input autoFocus value={custSearch} onChange={(e) => setCustSearch(e.target.value)} placeholder="Search customer..." style={{ ...inputStyle, background: "#f9fafb" }} />
                    </div>
                    <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                      {filteredCusts.map((c) => (
                        <div key={c.id} onClick={() => selectCustomer(c)} style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", borderTop: "1px solid #f3f4f6" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                          <div style={{ fontWeight: 600, color: "#111827" }}>{c.company_name}</div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>{c.customer_gstin}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "10px 14px", borderTop: "1.5px solid #e5e7eb" }}>
                   <button
 onClick={() => {
  setShowCustDropdown(false);


  setTimeout(() => {
    setCustomerModal(true);
  }, 100);
}}
  style={{
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  + Add New Customer
</button>
                    </div>
                  </div>
                )}
              </div>
            </Field>

            {/* Customer Type — disabled read-only pill, auto-detected from GSTIN */}
         <Field label="Customer Type">
  <TextInput
    value={customerType}
    readOnly
    placeholder="Customer Type"
  />
</Field>
          </div>
        </div>

        {/* Billing & Shipping forms */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <AddressForm form={billForm} update={updateBillForm} title="📋 Billing Address" customerType={customerType} fieldRules={fieldRules} />
          <div style={{ height: "1px", background: "#f0f4f8" }} />

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", paddingBottom: "8px", borderBottom: "1.5px solid #f0f4f8" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a5f" }}>🚚 Shipping Address</div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
                <input type="checkbox" checked={sameAsBilling} onChange={(e) => handleSameAsBilling(e.target.checked)} style={{ width: "14px", height: "14px", accentColor: "#1e3a5f", cursor: "pointer" }} />
                Same as Billing
              </label>
            </div>
            {sameAsBilling ? (
              <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "10px", border: "1.5px dashed #d1d5db", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                ✓ Shipping address is same as billing address
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              
                <Field label="Address Line 1">
                  <TextInput value={shipForm.customer_address_line1} onChange={(e) => updateShipForm("customer_address_line1", e.target.value)} placeholder="Building, Street" />
                </Field>
                <Field label="Address Line 2">
                  <TextInput value={shipForm.customer_address_line2} onChange={(e) => updateShipForm("customer_address_line2", e.target.value)} placeholder="Landmark" />
                </Field>
                <Field label="City">
                  <TextInput value={shipForm.customer_city} onChange={(e) => updateShipForm("customer_city", e.target.value)} placeholder="Mumbai" />
                </Field>
                <Field label="customer_state">
                  <SelectInput value={shipForm.customer_state} onChange={(e) => updateShipForm("customer_state", e.target.value)} placeholder="Select customer_state" options={indiancustomer_states.map((s) => ({ value: s.name, label: s.name }))} />
                </Field>
                <Field label="customer_state Code">
                  <TextInput value={shipForm.customer_state_code} onChange={(e) => updateShipForm("customer_state_code", e.target.value)} placeholder="27" readOnly={!!shipForm.customer_state} />
                </Field>
                <Field label="customer_pincode">
                  <TextInput value={shipForm.customer_pincode} onChange={(e) => updateShipForm("customer_pincode", e.target.value)} placeholder="400001" />
                </Field>
                <div />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* E-Way Bill */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", overflow: "hidden", marginBottom: "20px" }}>
        <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: ewayEnabled ? "1.5px solid #e5e7eb" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "15px" }}>🛣️</span>
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#374151", textTransform: "uppercase" }}>E-Way Bill Details</span>
            <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>(Required if invoice value &gt; ₹50,000)</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{ewayEnabled ? "Enabled" : "Disabled"}</span>
            <div onClick={() => setEwayEnabled(!ewayEnabled)} style={{ width: "42px", height: "24px", borderRadius: "12px", background: ewayEnabled ? "#1e3a5f" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: ewayEnabled ? "21px" : "3px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </label>
        </div>
        {ewayEnabled && (
          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>E-Way Bill Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              <Field label="Document Type" required>
                <SelectInput value={docType} onChange={(e) => setDocType(e.target.value)} placeholder="Select"
                  options={[{ value: "INV", label: "Tax Invoice" }, { value: "BIL", label: "Bill of Supply" }, { value: "BOE", label: "Bill of Entry" }, { value: "CHL", label: "Delivery Challan" }, { value: "OTH", label: "Others" }]}
                />
              </Field>
              <Field label="Approximate Distance (KM)" required>
                <TextInput type="number" value={approximateDistance} onChange={(e) => setApproximateDistance(e.target.value)} placeholder="e.g. 150" />
              </Field>
            </div>
            <div style={{ height: "1px", background: "#f0f4f8", margin: "0 0 20px 0" }} />
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>Transporter Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              <Field label="Transporter ID / Name">
                <TextInput value={transporterName} onChange={(e) => setTransporterName(e.target.value)} placeholder="Transporter name" />
              </Field>
              <Field label="Transporter Doc No">
                <TextInput value={transporterDocNo} onChange={(e) => setTransporterDocNo(e.target.value)} placeholder="LR / RR / Airway Bill No." />
              </Field>
            </div>
            <div style={{ height: "1px", background: "#f0f4f8", margin: "0 0 20px 0" }} />
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>Vehicle Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <Field label="Mode of Transport" required>
                <SelectInput value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} placeholder="Select Mode"
                  options={[{ value: "1", label: "Road" }, { value: "2", label: "Rail" }, { value: "3", label: "Air" }, { value: "4", label: "Ship" }]}
                />
              </Field>
              <Field label="Vehicle No">
                <TextInput value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="MH04AB1234" />
              </Field>
              <Field label="From">
                <TextInput value={from} onChange={(e) => setFrom(e.target.value)} placeholder="City / Place of dispatch" />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <Section title="Items / Services" icon="📦">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Description", "HSN/SAC", "Unit", "Qty", "Rate (₹)", "Disc %", "Taxable (₹)", "GST %", "Tax (₹)", "Total (₹)", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 10px", textAlign: ["Taxable (₹)", "Tax (₹)", "Total (₹)", "Rate (₹)"].includes(h) ? "right" : "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", color: "#6b7280", textTransform: "uppercase", borderBottom: "1.5px solid #e5e7eb", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 10px", color: "#9ca3af", fontWeight: 600, fontSize: "12px" }}>{i + 1}</td>
                  <td style={{ padding: "5px 6px", minWidth: "160px" }}>
                    <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Item description" style={{ ...inputStyle, padding: "6px 9px", fontSize: "12.5px" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "100px" }}>
                    <input value={item.itemCode} onChange={(e) => updateItem(i, "itemCode", e.target.value)} placeholder="Code" style={{ ...inputStyle, padding: "6px 9px", fontSize: "12.5px" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "80px" }}>
                    <input value={item.hsn} onChange={(e) => updateItem(i, "hsn", e.target.value)} style={{ ...inputStyle, padding: "6px 9px", fontSize: "12.5px" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "75px" }}>
                    <select value={item.unit} onChange={(e) => updateItem(i, "unit", e.target.value)} style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}>
                      {units.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "5px 6px", width: "65px" }}>
                  <input type="number" value={item.qty || ""}onChange={(e) =>
  updateItem(i, "qty", e.target.value === "" ? "" : Number(e.target.value))
}style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "center" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "100px" }}>
                    <input type="number" value={item.rate}onChange={(e) =>
  updateItem(i, "rate", e.target.value === "" ? "" : Number(e.target.value))
} style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "right" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "65px" }}>
                    <input type="number" value={item.discount} min={0} max={100} onChange={(e) =>
  updateItem(i, "discount", e.target.value === "" ? "" : Number(e.target.value))
} style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "center" }} />
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTaxable(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "5px 6px", width: "70px" }}>
                    <select value={item.gstRate} onChange={(e) => updateItem(i, "gstRate", Number(e.target.value))} style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}>
                      {gstOptions.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: "#374151", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTax(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTotal(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "5px 6px", textAlign: "center" }}>
                    <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px", padding: "4px 6px", borderRadius: "6px" }} title="Remove">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addItem} style={{ marginTop: "12px", padding: "8px 16px", border: "1.5px dashed #d1d5db", borderRadius: "8px", background: "none", fontSize: "13px", fontWeight: 600, color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "16px" }}>+</span> Add Item
        </button>

        {/* Totals */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "340px", background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1.5px solid #e5e7eb" }}>
            {[
              { label: "Subtotal (Gross)", value: `₹ ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
              { label: "Total Discount", value: `- ₹ ${totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
              { label: "Taxable Amount", value: `₹ ${taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "#374151" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "#e5e7eb", margin: "12px 0" }} />
            {!isInter ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
                  <span>CGST</span><span>₹ {cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
                  <span>SGST</span><span>₹ {sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
                <span>IGST</span><span>₹ {igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
              <span>Total Tax Amount</span>
              <span style={{ fontWeight: 600 }}>₹ {(cgst + sgst + igst).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
              <span>Round Off</span>
              <span style={{ color: roundOff >= 0 ? "#10b981" : "#ef4444" }}>{roundOff >= 0 ? "+" : ""}₹ {roundOff.toFixed(2)}</span>
            </div>
            <div style={{ background: "#1e3a5f", borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Grand Total</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: "10px", fontSize: "11.5px", color: "#6b7280", lineHeight: "1.5" }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>In Words: </span>
              {numberToWords(Math.round(grandTotal))} Rupees Only
            </div>
          </div>
        </div>
      </Section>

      {/* Tax Summary */}
      <Section title="Tax Summary (HSN-wise)" icon="📊">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Sr.", "HSN/SAC", "Taxable Value", ...(isInter ? ["IGST Rate", "IGST Amount"] : ["CGST Rate", "CGST Amount", "SGST Rate", "SGST Amount"]), "Total Tax"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: ["Taxable Value", "IGST Amount", "CGST Amount", "SGST Amount", "Total Tax"].includes(h) ? "right" : "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", color: "#6b7280", textTransform: "uppercase", borderBottom: "1.5px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(taxSummary).map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.hsn}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  {isInter ? (
                    <>
                      <td style={{ padding: "10px 12px" }}>{row.rate}%</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.igstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "10px 12px" }}>{row.rate / 2}%</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.cgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: "10px 12px" }}>{row.rate / 2}%</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.sgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    </>
                  )}
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1e3a5f" }}>₹ {(row.cgstAmt + row.sgstAmt + row.igstAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr style={{ background: "#f0f4f8" }}>
                <td colSpan={2} style={{ padding: "10px 12px", fontWeight: 700, fontSize: "12px", color: "#374151" }}>TOTAL</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                {isInter ? (
                  <><td></td><td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td></>
                ) : (
                  <><td></td><td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td><td></td><td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td></>
                )}
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1e3a5f" }}>₹ {(cgst + sgst + igst).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Footer Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingBottom: "40px" }}>
        <button style={{ padding: "11px 28px", border: "1.5px solid #d1d5db", borderRadius: "8px", background: "#fff", fontSize: "13.5px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
        <button  onClick={handleSaveInvoice} style={{ padding: "11px 28px", border: "none", borderRadius: "8px", background: "#1e3a5f", fontSize: "13.5px", fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.3px" }}>💾 Save Invoice</button>
      </div>


{customerModal && (
  <CustomerModal
    onClose={() => setCustomerModal(false)}
   onCustomerCreated={(newCustomer) => {
  setCustomerModal(false);

  // ✅ ADD IMMEDIATELY TO LIST (IMPORTANT FIX)
  setCustomers((prev) => [newCustomer, ...prev]);

  // optional (can keep)
  loadCustomers();

  // ✅ auto select
  setSelectedCustomer(newCustomer);
  setBillForm({ ...newCustomer });
  setCustomerID(newCustomer.id);

  setCustomerType(
    newCustomer.customer_gstin &&
    newCustomer.customer_gstin.trim().length === 15
      ? "B2B"
      : "B2C"
  );
}}
  />
)}

    </div>
  );
}