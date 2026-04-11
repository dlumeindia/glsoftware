import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Table from "../../components/Table";
import Button from "../../components/Button";
import ConfirmBox from "../../components/ConfirmBox";
import toast from "react-hot-toast";


const columns = [
{ key: "customer_name", label: "Customer Name" },
{ key: "company_name", label: "Company" },
{ key: "customer_gstin", label: "GSTIN" },
{ key: "full_address", label: "Billing Address" },
{ key: "customer_phone", label: "Phone" },



];

const CustomerList = () => {
const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
 const [confirmOpen, setConfirmOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
  const res = await window.electronAPI.getCustomers();

  if (res.success) {
    const formatted = res.data.map((c) => ({
      ...c,
      full_address: [
        c.customer_address_line1,
        c.customer_address_line2,
        c.customer_city,
        c.customer_state,
        c.customer_pincode
      ]
        .filter(Boolean)
        .join(", ")
    }));

    setCustomers(formatted);
  } else {
    console.error(res.error);
  }
};

return ( <div className="space-y-6">
  <ConfirmBox
  open={confirmOpen}
  title="Delete Customer"
  message="Are you sure you want to delete this customer?"
  onCancel={() => setConfirmOpen(false)}
  onConfirm={async () => {
    setConfirmOpen(false);

    try {
      const res = await window.electronAPI.deleteCust(selectedId);

      if (res.success) {
        toast.success("Customer deleted successfully");
        loadCustomers();
      } else {
        toast.error("Failed to delete customer");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }}
/>

  {/* Header */}
  <div className="flex items-center justify-between">
   

    <Button
      variant="navy"
      size="md"
      className="flex items-center gap-2"
      onClick={() => navigate("/customers")}
    >
      <FiPlus size={16} />
      Add Customer
    </Button>
  </div>

  {/* Customer Table */}
<Table
  columns={columns}
  data={customers}
  searchPlaceholder="Search customers..."
  onRowClick={(row) => navigate(`/customers/${row.id}`)}
onDelete={(row) => {
  setSelectedId(row.id);
  setConfirmOpen(true);
}}
/>

</div>


);
};

export default CustomerList;
