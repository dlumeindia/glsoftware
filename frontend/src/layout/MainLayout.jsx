import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineUser,
} from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { ChevronDown } from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: HiOutlineViewGrid, path: "/dashboard" },
  { label: "Invoices", icon: HiOutlineDocumentText, path: "/invoices" },
  { label: "Create Invoice", icon: HiOutlinePlusCircle, path: "/create-invoice" },
  { label: "Customers", icon: HiOutlineUser, path: "/customer-list" },
  { label: "Logout", icon: HiOutlineUser, path: "/logout" },
];

const MainLayout = () => {
  const { user, logout  } = useAuth();
    const navigate = useNavigate();
const location = useLocation();
  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white bg-[#1e3a8a]">
            <HiOutlineSquares2X2 size={20} />
          </div>
          <span className="font-semibold text-gray-800 text-base">
            GLS Precious
          </span>
        </div>

        {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
  {navItems.map(({ label, icon: Icon, path }) => {

    const isActive =
      location.pathname.startsWith(path) ||
      (path === "/customer-list" && location.pathname.startsWith("/customer")) ||
      (path === "/invoices" && location.pathname.startsWith("/invoice"));

        const baseClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`;

    // Logout Button
    if (path === "/logout") {
      return (
        <button
          key={label}
          onClick={() => {
            logout();
            navigate("/");
          }}
          className={`${baseClass} w-full text-left`}
         
        >
          <Icon size={19} className="text-gray-400" />
          <span>{label}</span>
        </button>
      );
    }

    
    return (
      <NavLink
        key={label}
        to={path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        }`}
      >
{Icon && (
  <Icon
    size={19}
    className={isActive ? "text-blue-600" : "text-gray-400"}
  />
)}
        <span>{label}</span>
      </NavLink>
    );
  })}
</nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">

   <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3.5">

  {/* Welcome */}
  <div>
    <p className="font-semibold text-gray-900 text-base leading-tight">
      Welcome back, {user?.name || "User"} 👋
    </p>
    <p className="text-gray-400 text-sm">
      Here's your invoice overview.
    </p>
  </div>

  {/* Profile */}
  <div
    onClick={() => navigate("/profile")}
    className="flex items-center gap-3 cursor-pointer group"
  >
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-[#1e3a8a]">
      {user?.email?.charAt(0)?.toUpperCase() || "U"}
    </div>

    <div className="flex flex-col">
      <p className="text-sm font-semibold text-gray-800 leading-tight">
        {user?.email?.split("@")[0] || "User"}
      </p>
      <p className="text-xs text-gray-400">
        {user?.email || "user@email.com"}
      </p>
    </div>

    <ChevronDown
      size={16}
      className="text-gray-400 group-hover:text-gray-600 transition"
    />
  </div>

</header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;