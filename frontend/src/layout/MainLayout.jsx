import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineUser,
} from "react-icons/hi";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useState, useEffect, createContext } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { ChevronDown } from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PageTitleContext = createContext(null);

const navItems = [
  { label: "Dashboard", icon: HiOutlineViewGrid, path: "/dashboard" },
  { label: "Invoices", icon: HiOutlineDocumentText, path: "/invoices" },
  { label: "Create Invoice", icon: HiOutlinePlusCircle, path: "/create-invoice" },
  { label: "Customers", icon: HiOutlineUser, path: "/customer-list" },
];

const pageHeaders = {
  "/dashboard": (name, companyName) => ({
    title: `Welcome back, ${name} 👋`,
    subtitle: companyName || "Here's your invoice overview.",
  }),
  "/invoices": () => ({ title: "Invoices", subtitle: "Manage and track all your invoices." }),
  "/create-invoice": () => ({ title: "Create Invoice", subtitle: "Fill in the details to generate a new invoice." }),
  "/customer-list": () => ({ title: "Customers", subtitle: "View and manage your customer directory." }),
    "/customers": () => ({
    title: "Add Customer",
    subtitle: "Create a new customer record",
  }),
  "/profile": () => ({ title: "Profile", subtitle: "Manage your business and account settings." }),
};

const getHeader = (pathname, name, companyName) => {
  if (pageHeaders[pathname]) return pageHeaders[pathname](name, companyName);
  const matched = Object.keys(pageHeaders).find(
    (key) => key !== "/dashboard" && pathname.startsWith(key)
  );
  return matched ? pageHeaders[matched](name, companyName) : null;
};

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dynamicTitle, setDynamicTitle] = useState(null);
  const [profile, setProfile] = useState({ business_name: "" });

  useEffect(() => {
    const loadProfile = async () => {
      const data = await window.electronAPI.getProfile(user.id);
      if (data) setProfile(data);
    };
    loadProfile();
  }, []);

  // Reset dynamic title on route change so stale names don't persist
  useEffect(() => {
    setDynamicTitle(null);
  }, [location.pathname]);

  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const companyName = profile?.business_name || "";
  const staticHeader = getHeader(location.pathname, userName, companyName);
const { title, subtitle } =
  dynamicTitle ||
  staticHeader || {
    title: `Welcome back, ${userName} 👋`,
    subtitle: "",
  };

  return (
    <PageTitleContext.Provider value={setDynamicTitle}>
      <div className="flex h-screen bg-gray-50 font-sans">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white bg-[#1e3a8a]">
              <HiOutlineSquares2X2 size={20} />
            </div>
            <span className="font-semibold text-gray-800 text-base">
              {profile?.business_name || "D'Lume Software"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive =
                location.pathname.startsWith(path) ||
                (path === "/customer-list" && location.pathname.startsWith("/customer")) ||
                (path === "/invoices" && location.pathname.startsWith("/invoice"));

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
                    <Icon size={19} className={isActive ? "text-blue-600" : "text-gray-400"} />
                  )}
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-100">
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full text-left"
            >
              <HiOutlineArrowRightOnRectangle size={19} className="text-gray-400" />
              <span>Logout</span>
            </button>
          </div>

        </aside>

        {/* Main Section */}
        <div className="flex-1 flex flex-col overflow-hidden">

          <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3.5">
            <div>
              <p className="font-semibold text-gray-900 text-base leading-tight">{title}</p>
              {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
            </div>

            <div onClick={() => navigate("/profile")} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-[#1e3a8a]">
                {user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-gray-400">{user?.email || "user@email.com"}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition" />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <Outlet />
          </main>

        </div>
      </div>
    </PageTitleContext.Provider>
  );
};

export default MainLayout;