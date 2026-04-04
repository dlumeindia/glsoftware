import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Table from "../../components/Table";
import Button from "../../components/Button";


const columns = [
{ key: "customer_name", label: "Customer Name" },
{ key: "company_name", label: "Company" },
{ key: "customer_gstin", label: "GSTIN" },
{ key: "customer_address_line1", label: "Address" },
{ key: "customer_phone", label: "Phone" },



];

const CustomerList = () => {
const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

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

return ( <div className="space-y-6">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">
        All Customers
      </h1>
      <p className="text-sm text-gray-400">
        Manage all your customers in one place.
      </p>
    </div>

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
  onDelete={async (row) => {
    if (!window.confirm("Delete this customer?")) return;

    const res = await window.electronAPI.deleteCust(row.id);

    if (res.success) {
      loadCustomers();
    }
  }}
/>

</div>


);
};

export default CustomerList;
