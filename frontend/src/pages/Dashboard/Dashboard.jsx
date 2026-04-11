import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import Table from "../../components/Table";
import {
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
   HiOutlineCurrencyRupee,
} from "react-icons/hi";

const columns = [
  {
    key: "number",
    label: "Invoice Number",
    render: (value) => (
      <span className="font-mono text-sm font-medium text-gray-700">
        #{value}
      </span>
    ),
  },
  {
    key: "client",
    label: "Client",
    render: (value) => (
      <div className="font-medium text-gray-800">{value}</div>
    ),
  },
  {
    key: "company_name",
    label: "Company",
    render: (value) => (
      <div className="font-medium text-gray-800">{value || "—"}</div>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (value) => (
      <span className="font-semibold text-gray-800">
        ₹{Number(value).toFixed(2)}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    align: "center",
   render: (value) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {value}
      </span>
    </div>
  ),
  },
];
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const statsData = await window.electronAPI.getDashboardStats();
      const invoicesData = await window.electronAPI.getRecentInvoices();
      setStats(statsData);
      setRecentInvoices(invoicesData);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  return (
    <div className="space-y-6">

    
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
  title="Total Invoices"
  value={`${Number(stats.totalInvoices)}`}
  icon={HiOutlineDocumentText}
  iconBg="bg-blue-100"
  iconColor="text-blue-600"
/>
      <StatCard
  title="Total Paid"
  value={`₹${Number(stats.totalPaid).toFixed(2)}`}
  icon={HiOutlineCurrencyRupee}
  iconBg="bg-green-100"
  iconColor="text-green-600"
/>
<StatCard
  title="Total Unpaid"
  value={`₹${Number(stats.totalUnpaid).toFixed(2)}`}
  icon={HiOutlineCurrencyRupee}
  iconBg="bg-red-100"
  iconColor="text-red-600"
/>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Invoices
          </h2>
          <button
            onClick={() => navigate("/invoices")}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            View All
          </button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={recentInvoices}
          searchPlaceholder="Search invoices..."
          onRowClick={(row) => navigate(`/invoice/${row.id}`)}
        />

      </div>
    </div>
  );
};

export default Dashboard;