"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuth, performLogout } from "../store/slices/authSlice";
import {
  loadDataFromStorage,
  setActiveTab,
  addKekeAsset,
  updateKekeAsset,
  deleteKekeAsset,
  addAggregator,
  updateAggregator,
  deleteAggregator,
  addDriver,
  updateDriver,
  deleteDriver,
  type KekeAsset,
  type Aggregator,
  type Driver,
} from "../store/slices/dataSlice";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import {
  CreditCard,
  TrendingUp,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Import components
import Sidenav from "../components/ui/Sidenav";
import MetricCard from "../components/ui/MetricCard";
import Table from "../components/ui/Table";
import OverviewTab from "../components/tabs/OverviewTab";
import KekeForm from "../components/forms/KekeForm";
import AggregatorForm from "../components/forms/AggregatorForm";
import DriverForm from "../components/forms/DriverForm";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { customTooltipStyle } from "../utils/chartConfig";

const PICNGDashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, canEdit, user } = useAuth();
  const { kekeAssets, aggregators, drivers, isLoaded, activeTab } =
    useAppSelector((state) => state.data);

  // State for mobile sidenav
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading states for operations
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    itemType: "",
  });

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState<
    KekeAsset | Aggregator | Driver | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAggregator, setSelectedAggregator] = useState("");

  // Dashboard metrics
  const dashboardMetrics = {
    totalKekesAssigned: 25,
    kekesPickedUp: 20,
    kekesActivelyDeployed: 18,
    kekesYetToPickup: 5,
    totalWeeklyCollection: 187500,
    cardPaymentRatio: 0.79,
    totalRebatesIssued: 9375,
    akupayCommission: 18750,
    picngSettlement: 159375,
  };

  // Chart data
  const weeklyCollectionData = [
    { date: "Week 1", collection: 175000, target: 180000 },
    { date: "Week 2", collection: 182000, target: 180000 },
    { date: "Week 3", collection: 178000, target: 180000 },
    { date: "Week 4", collection: 185000, target: 180000 },
    { date: "Week 5", collection: 187500, target: 180000 },
    { date: "Week 6", collection: 195000, target: 180000 },
    { date: "Week 7", collection: 172000, target: 180000 },
  ];

  const paymentMethodData = [
    { name: "Card Payments", value: 79, color: "#10B981" },
    { name: "Cash Payments", value: 21, color: "#F59E0B" },
  ];

  const locationPerformanceData = [
    { location: "Victoria Island", revenue: 45000, kekeCount: 6 },
    { location: "Ikeja", revenue: 38000, kekeCount: 5 },
    { location: "Surulere", revenue: 32000, kekeCount: 4 },
    { location: "Yaba", revenue: 28000, kekeCount: 3 },
  ];

  // Modal management
  const openModal = (
    type: string,
    item: KekeAsset | Aggregator | Driver | null = null
  ) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType("");
  };

  // CRUD operations for Keke Assets
  const handleSaveKeke = async (formData: Partial<KekeAsset>) => {
    setIsOperationLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingItem) {
        dispatch(updateKekeAsset({ ...editingItem, ...formData } as KekeAsset));
        toast.success("Keke asset updated successfully!", {
          description: `Updated ${
            formData.registrationNumber ||
            (editingItem as KekeAsset).registrationNumber
          }`,
        });
      } else {
        dispatch(addKekeAsset(formData as Omit<KekeAsset, "id">));
        toast.success("Keke asset created successfully!", {
          description: `Added ${formData.registrationNumber}`,
        });
      }
      closeModal();
    } catch (error) {
      console.error("Save operation failed:", error);
      toast.error("Operation failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDeleteKeke = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Keke Asset",
      message:
        "Are you sure you want to delete this Keke asset? This action cannot be undone.",
      onConfirm: async () => {
        setIsOperationLoading(true);
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(deleteKekeAsset(id));
        toast.success("Keke asset deleted successfully!");
        setIsOperationLoading(false);
      },
      itemType: "keke",
    });
  };

  // CRUD operations for Aggregators
  const handleSaveAggregator = async (formData: Partial<Aggregator>) => {
    setIsOperationLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingItem) {
        dispatch(
          updateAggregator({ ...editingItem, ...formData } as Aggregator)
        );
        toast.success("Aggregator updated successfully!", {
          description: `Updated ${
            formData.name || (editingItem as Aggregator).name
          }`,
        });
      } else {
        dispatch(addAggregator(formData as Omit<Aggregator, "id">));
        toast.success("Aggregator created successfully!", {
          description: `Added ${formData.name}`,
        });
      }
      closeModal();
    } catch (error) {
      console.error("Save operation failed:", error);
      toast.error("Operation failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDeleteAggregator = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Aggregator",
      message:
        "Are you sure you want to delete this aggregator? This action cannot be undone.",
      onConfirm: async () => {
        setIsOperationLoading(true);
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(deleteAggregator(id));
        toast.success("Aggregator deleted successfully!");
        setIsOperationLoading(false);
      },
      itemType: "aggregator",
    });
  };

  // CRUD operations for Drivers
  const handleSaveDriver = async (formData: Partial<Driver>) => {
    setIsOperationLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingItem) {
        dispatch(updateDriver({ ...editingItem, ...formData } as Driver));
        toast.success("Driver updated successfully!", {
          description: `Updated ${
            formData.name || (editingItem as Driver).name
          }`,
        });
      } else {
        dispatch(addDriver(formData as Omit<Driver, "id">));
        toast.success("Driver created successfully!", {
          description: `Added ${formData.name}`,
        });
      }
      closeModal();
    } catch (error) {
      console.error("Save operation failed:", error);
      toast.error("Operation failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDeleteDriver = (id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Driver",
      message:
        "Are you sure you want to delete this driver? This action cannot be undone.",
      onConfirm: async () => {
        setIsOperationLoading(true);
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(deleteDriver(id));
        toast.success("Driver deleted successfully!");
        setIsOperationLoading(false);
      },
      itemType: "driver",
    });
  };

  // Authentication check
  useEffect(() => {
    dispatch(checkAuth());
    dispatch(loadDataFromStorage());
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle logout
  const handleLogout = () => {
    dispatch(performLogout());
    router.push("/login");
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "#0B4F26" }}
        ></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Export data function
  const handleExportData = async () => {
    setIsOperationLoading(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const exportData = {
        exportDate: new Date().toISOString(),
        exportedBy: user?.username,
        summary: {
          totalKekesAssigned: dashboardMetrics.totalKekesAssigned,
          kekesActivelyDeployed: dashboardMetrics.kekesActivelyDeployed,
          totalWeeklyCollection: dashboardMetrics.totalWeeklyCollection,
          cardPaymentRatio: dashboardMetrics.cardPaymentRatio,
          totalRebatesIssued: dashboardMetrics.totalRebatesIssued,
        },
        kekeAssets: kekeAssets.map((keke) => ({
          id: keke.id,
          registrationNumber: keke.registrationNumber,
          aggregator: keke.aggregator,
          driver: keke.driver,
          location: keke.location,
          status: keke.status,
          weeklyRevenue: keke.weeklyRevenue,
          cardPaymentRatio: keke.cardPaymentRatio,
          deploymentDate: keke.deploymentDate,
        })),
        aggregators: aggregators.map((agg) => ({
          id: agg.id,
          name: agg.name,
          kekesAssigned: agg.kekesAssigned,
          kekesDeployed: agg.kekesDeployed,
          avgWeeklyCollection: agg.avgWeeklyCollection,
          cardPaymentRatio: agg.cardPaymentRatio,
        })),
        drivers: drivers.map((driver) => ({
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          kekeId: driver.kekeId,
          licenseExpiry: driver.licenseExpiry,
          kycStatus: driver.kycStatus,
          appUsage: driver.appUsage,
        })),
      };

      // Convert to CSV format
      const csvContent = generateCSV(exportData);

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `PICNG_Dashboard_Export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast.success("Data exported successfully!", {
        description: `Exported to PICNG_Dashboard_Export_${
          new Date().toISOString().split("T")[0]
        }.csv`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsOperationLoading(false);
    }
  };

  // Generate CSV from data
  const generateCSV = (data: any) => {
    let csv = "PICNG Dashboard Export\n";
    csv += `Export Date,${data.exportDate}\n`;
    csv += `Exported By,${data.exportedBy}\n\n`;

    // Summary section
    csv += "SUMMARY\n";
    csv += "Metric,Value\n";
    csv += `Total Kekes Assigned,${data.summary.totalKekesAssigned}\n`;
    csv += `Kekes Actively Deployed,${data.summary.kekesActivelyDeployed}\n`;
    csv += `Total Daily Collection,₦${data.summary.totalDailyCollection}\n`;
    csv += `Card Payment Ratio,${(data.summary.cardPaymentRatio * 100).toFixed(
      1
    )}%\n`;
    csv += `Total Rebates Issued,₦${data.summary.totalRebatesIssued}\n\n`;

    // Keke Assets section
    csv += "KEKE ASSETS\n";
    csv +=
      "ID,Registration Number,Aggregator,Driver,Location,Status,Daily Revenue,Card Payment Ratio,Deployment Date\n";
    data.kekeAssets.forEach((keke: any) => {
      csv += `${keke.id},${keke.registrationNumber},${keke.aggregator},${
        keke.driver
      },${keke.location},${keke.status},₦${keke.dailyRevenue},${(
        keke.cardPaymentRatio * 100
      ).toFixed(1)}%,${keke.deploymentDate}\n`;
    });
    csv += "\n";

    // Aggregators section
    csv += "AGGREGATORS\n";
    csv +=
      "ID,Name,Kekes Assigned,Kekes Deployed,Avg Daily Collection,Card Payment Ratio\n";
    data.aggregators.forEach((agg: any) => {
      csv += `${agg.id},${agg.name},${agg.kekesAssigned},${
        agg.kekesDeployed
      },₦${agg.avgDailyCollection},${(agg.cardPaymentRatio * 100).toFixed(
        1
      )}%\n`;
    });
    csv += "\n";

    // Drivers section
    csv += "DRIVERS\n";
    csv += "ID,Name,Phone,Keke ID,License Expiry,KYC Status,App Usage\n";
    data.drivers.forEach((driver: any) => {
      csv += `${driver.id},${driver.name},${driver.phone},${
        driver.kekeId || "Not Assigned"
      },${driver.licenseExpiry},${driver.kycStatus},${driver.appUsage}\n`;
    });

    return csv;
  };

  // Filter functions
  const filteredKekeAssets = kekeAssets.filter((keke) => {
    const matchesSearch =
      keke.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keke.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keke.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAggregator =
      !selectedAggregator || keke.aggregator === selectedAggregator;
    return matchesSearch && matchesAggregator;
  });

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidenav Component */}
      <Sidenav
        isSidenavOpen={isSidenavOpen}
        setIsSidenavOpen={setIsSidenavOpen}
        activeTab={activeTab}
        setActiveTab={(tab: string) => dispatch(setActiveTab(tab))}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidenavOpen(true)}
                  className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl capitalize font-bold text-gray-900">
                    {activeTab}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExportData}
                  disabled={isOperationLoading}
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "rgb(11, 79, 38)",
                  }}
                >
                  {isOperationLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isOperationLoading ? "Exporting..." : "Export Data"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <OverviewTab
              dashboardMetrics={dashboardMetrics}
              weeklyCollectionData={weeklyCollectionData}
              paymentMethodData={paymentMethodData}
              locationPerformanceData={locationPerformanceData}
            />
          )}

          {/* Asset Management Tab */}
          {activeTab === "assets" && (
            <div className="space-y-6">
              {/* Filters and Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    {/* <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search assets..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div> */}
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedAggregator}
                      onChange={(e) => setSelectedAggregator(e.target.value)}
                    >
                      <option value="">All Aggregators</option>
                      {aggregators.map((agg) => (
                        <option key={agg.id} value={agg.name}>
                          {agg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => openModal("keke")}
                      className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-80"
                      style={{
                        backgroundColor: "rgb(11, 79, 38)",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Keke Asset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Assets Table */}
              <Table
                data={filteredKekeAssets}
                columns={[
                  {
                    key: "id",
                    header: "Keke ID",
                    sortable: true,
                    className: "font-medium",
                  },
                  {
                    key: "registrationNumber",
                    header: "Registration",
                    sortable: true,
                  },
                  {
                    key: "driver",
                    header: "Driver",
                    sortable: true,
                  },
                  {
                    key: "aggregator",
                    header: "Aggregator",
                    sortable: true,
                  },
                  {
                    key: "location",
                    header: "Location",
                    sortable: true,
                    render: (keke) => (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {keke.location}
                      </div>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    sortable: true,
                    render: (keke) => (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          keke.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : keke.status === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {keke.status}
                      </span>
                    ),
                  },
                  {
                    key: "weeklyRevenue",
                    header: "Weekly Revenue",
                    sortable: true,
                    render: (keke) => `₦${(keke.weeklyRevenue || 0).toLocaleString()}`,
                  },
                  {
                    key: "cardPaymentRatio",
                    header: "Card Ratio",
                    sortable: true,
                    render: (keke) =>
                      `${(keke.cardPaymentRatio * 100).toFixed(1)}%`,
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (keke) => (
                      <div className="flex items-center space-x-2">
                        {canEdit && (
                          <>
                            <button
                              onClick={() => openModal("keke", keke)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteKeke(keke.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ),
                  },
                ]}
                itemsPerPage={10}
                searchable={true}
                searchPlaceholder="Search keke assets..."
                emptyMessage="No keke assets found"
              />
            </div>
          )}

          {/* Aggregators Tab */}
          {activeTab === "aggregators" && (
            <div className="space-y-6">
              <div className="flex justify-end items-center">
                {canEdit && (
                  <button
                    onClick={() => openModal("aggregator")}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-80"
                    style={{
                      backgroundColor: "rgb(11, 79, 38)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Aggregator</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aggregators.map((aggregator) => (
                  <div
                    key={aggregator.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {aggregator.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {aggregator.id}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <>
                            <button
                              onClick={() =>
                                openModal("aggregator", aggregator)
                              }
                              className="p-2 text-black hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAggregator(aggregator.id)
                              }
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">
                          Assets Assigned
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {aggregator.kekesAssigned}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">
                          Currently Deployed
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {aggregator.kekesDeployed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">
                          Deployment Rate
                        </span>
                        <span className={`text-sm font-bold ${
                          (aggregator.kekesDeployed / aggregator.kekesAssigned) >= 0.8 
                            ? 'text-green-600' 
                            : (aggregator.kekesDeployed / aggregator.kekesAssigned) >= 0.6 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {((aggregator.kekesDeployed / aggregator.kekesAssigned) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">
                          Avg Weekly Collection
                        </span>
                        <span className="text-sm font-bold text-black">
                          ₦{(aggregator.avgWeeklyCollection || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Card Payment Ratio
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-green-600">
                            {(aggregator.cardPaymentRatio * 100).toFixed(1)}%
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{ width: `${aggregator.cardPaymentRatio * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Deployment Progress
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          {aggregator.kekesDeployed}/{aggregator.kekesAssigned}
                        </p>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{
                            width: `${(aggregator.kekesDeployed / aggregator.kekesAssigned) * 100}%`
                          }}
                        />
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Transaction Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Total Collection This Week"
                  value={`₦${dashboardMetrics.totalWeeklyCollection.toLocaleString()}`}
                  icon={DollarSign}
                  trend={8.3}
                  color="emerald"
                />
                <MetricCard
                  title="Card Transactions"
                  value={`${(dashboardMetrics.cardPaymentRatio * 100).toFixed(
                    1
                  )}%`}
                  icon={CreditCard}
                  trend={3.7}
                  color="blue"
                />
                <MetricCard
                  title="Total Rebates Issued"
                  value={`₦${dashboardMetrics.totalRebatesIssued.toLocaleString()}`}
                  icon={TrendingUp}
                  trend={12.5}
                  color="purple"
                />
              </div>

              {/* Transaction Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Weekly Collection Trend
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Revenue performance tracking
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-2"></div>
                        <span className="text-gray-600">Collections</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-1 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Target</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={weeklyCollectionData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="collectionLineGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3B82F6"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#1D4ED8"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="0"
                        stroke="#F1F5F9"
                        vertical={false}
                        horizontal={true}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                        domain={["dataMin - 10000", "dataMax + 10000"]}
                        tickFormatter={(value) =>
                          `₦${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        {...customTooltipStyle}
                        formatter={(value, name) => [
                          `₦${value.toLocaleString()}`,
                          name === "collection" ? "Collections" : "Target",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="collection"
                        stroke="url(#collectionLineGradient)"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        activeDot={{
                          r: 6,
                          stroke: "#3B82F6",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Location Revenue
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Revenue distribution by location
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={locationPerformanceData} barGap={4}>
                      <CartesianGrid
                        strokeDasharray="0"
                        stroke="#F3F4F6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="location"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        domain={[0, "dataMax + 5000"]}
                        tickFormatter={(value) =>
                          `₦${(value / 1000).toFixed(0)}K`
                        }
                        dx={-20}
                      />
                      <Tooltip
                        {...customTooltipStyle}
                        formatter={(value) => [
                          `₦${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                        {locationPerformanceData.map((_, index) => {
                          const colors = [
                            "#3b82f6",
                            "#ef4444",
                            "#10b981",
                            "#f59e0b",
                          ];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === "financial" && (
            <div className="space-y-6">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Weekly Collection"
                  value={`₦${dashboardMetrics.totalWeeklyCollection.toLocaleString()}`}
                  icon={DollarSign}
                  color="emerald"
                />
                <MetricCard
                  title="Akupay Commission"
                  value={`₦${dashboardMetrics.akupayCommission.toLocaleString()}`}
                  icon={CreditCard}
                  color="blue"
                />
                <MetricCard
                  title="Rebates Issued"
                  value={`₦${dashboardMetrics.totalRebatesIssued.toLocaleString()}`}
                  icon={TrendingUp}
                  color="purple"
                />
                <MetricCard
                  title="PICNG Settlement"
                  value={`₦${dashboardMetrics.picngSettlement.toLocaleString()}`}
                  icon={CheckCircle}
                  color="green"
                />
              </div>

              {/* Financial Breakdown Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">
                    Per-Keke Financial Summary
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keke ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weekly Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Card %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rebates Given
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akupay Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net to PICNG
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kekeAssets.map((keke) => {
                        const akupayEarnings = (keke.weeklyRevenue || 0) * 0.1; // 10% commission
                        const netToPicng =
                          (keke.weeklyRevenue || 0) -
                          akupayEarnings -
                          (keke.rebatesIssued || 0);

                        return (
                          <tr key={keke.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {keke.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦{(keke.weeklyRevenue || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(keke.cardPaymentRatio * 100).toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦{(keke.rebatesIssued || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦{akupayEarnings.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦{netToPicng.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Drivers Tab */}
          {activeTab === "drivers" && (
            <div className="space-y-6">
              <div className="flex justify-end items-center">
                {canEdit && (
                  <button
                    onClick={() => openModal("driver")}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-80"
                    style={{
                      backgroundColor: "rgb(11, 79, 38)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Driver</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Driver ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Keke
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License Expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KYC Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          App Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drivers.map((driver) => {
                        const isLicenseExpiring =
                          new Date(driver.licenseExpiry) <=
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                        return (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {driver.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.kekeId || "Not Assigned"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {driver.licenseExpiry}
                                {isLicenseExpiring && (
                                  <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  driver.kycStatus === "Complete"
                                    ? "bg-green-100 text-green-800"
                                    : driver.kycStatus === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {driver.kycStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  driver.appUsage === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {driver.appUsage}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {canEdit && (
                                  <>
                                    <button
                                      onClick={() =>
                                        openModal("driver", driver)
                                      }
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteDriver(driver.id)
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && modalType === "keke" && (
        <KekeForm
          editingItem={editingItem}
          aggregators={aggregators}
          onClose={closeModal}
          onSave={handleSaveKeke}
        />
      )}
      {showModal && modalType === "aggregator" && (
        <AggregatorForm
          editingItem={editingItem}
          onClose={closeModal}
          onSave={handleSaveAggregator}
        />
      )}
      {showModal && modalType === "driver" && (
        <DriverForm
          editingItem={editingItem}
          kekeAssets={kekeAssets}
          onClose={closeModal}
          onSave={handleSaveDriver}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        isLoading={isOperationLoading}
      />

      {/* Loading Overlay */}
      {isOperationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: "#0B4F26" }}
            ></div>
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PICNGDashboard;
