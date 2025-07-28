import React from "react";
import {
  X,
  LogOut,
  Activity,
  Truck,
  Users,
  CreditCard,
  DollarSign,
} from "lucide-react";

interface SidenavProps {
  isSidenavOpen: boolean;
  setIsSidenavOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const Sidenav: React.FC<SidenavProps> = ({
  isSidenavOpen,
  setIsSidenavOpen,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navigationItems = [
    { id: "overview", name: "Overview", icon: Activity },
    { id: "assets", name: "Asset Management", icon: Truck },
    { id: "aggregators", name: "Aggregators", icon: Users },
    { id: "transactions", name: "Transactions", icon: CreditCard },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "drivers", name: "Drivers", icon: Users },
  ];

  const handleLogout = () => {
    setIsSidenavOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <style jsx>{`
        .nav-button:hover:not(.active) {
          background-color: #155c35 !important;
        }
        .logout-button:hover {
          background-color: #dc2626 !important;
        }
      `}</style>
      {/* Mobile overlay */}
      {isSidenavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidenavOpen(false)}
        />
      )}

      {/* Sidenav */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#0B4F26" }}
      >
        <div
          className="flex items-center justify-between h-16 px-6"
          style={{ backgroundColor: "#083d1e" }}
        >
          <h2 className="text-white font-semibold text-lg">PICNG Dashboard</h2>
          <button
            onClick={() => setIsSidenavOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 flex flex-col h-full">
          <div className="flex-1">
            {navigationItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidenavOpen(false);
                }}
                className={`nav-button w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg text-left transition-all duration-200 text-green-100 hover:text-white ${
                  activeTab === tab.id ? "active text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? "#155c35" : "transparent",
                }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
            <div className="pb-4">
              <button
                onClick={handleLogout}
                className="logout-button w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-green-100 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidenav;
