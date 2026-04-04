import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Invoices from "../pages/Invoices/Invoices";
import CreateInvoice from "../pages/Invoices/CreateInvoice";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Customers from "../pages/Customers/Customers";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";
import Profile from "../pages/Profile/Profile";
import DeliveryChallan from "../pages/Challan/Deliverychallan";
import CustomerList from "../pages/Customers/CustomerList";
import CustomerProfile from "../pages/Customers/Customerprofile";
import SignUp from "../pages/Auth/SignUp";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />


      {/* Protected Wrapper */}
      <Route element={<ProtectedRoute />}>
        
        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="customers" element={<Customers />} />
          <Route path="invoice/:id" element={<InvoiceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerProfile />} />

        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;