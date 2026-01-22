/* eslint-disable @typescript-eslint/no-explicit-any */
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
  MapPin,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  AlertTriangle,
  BanknoteIcon,
} from "lucide-react";

// Import components
import Sidenav from "../components/ui/Sidenav";
import MetricCard from "../components/ui/MetricCard";
import Table from "../components/ui/Table";
import OverviewTab from "../components/tabs/OverviewTab";
import KekeForm from "../components/forms/KekeForm";
import AggregatorForm from "../components/forms/AggregatorForm";
import DriverForm from "../components/forms/DriverForm";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const PICNGDashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, canEdit } = useAuth();
  const { kekeAssets, aggregators, drivers, activeTab } = useAppSelector(
    (state) => state.data
  );

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
  const [searchTerm] = useState("");
  const [selectedAggregator, setSelectedAggregator] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("march");

  // Dashboard metrics
  const totalRevenue = aggregators.reduce((sum, agg) => sum + (agg.totalRevenue || 0), 0);
  const augustRevenue = aggregators.reduce((sum, agg) => sum + (agg.augustRevenue || 0), 0);
  const septemberRevenue = aggregators.reduce((sum, agg) => sum + (agg.septemberRevenue || 0), 0);
  const octoberRevenue = aggregators.reduce((sum, agg) => sum + (agg.octoberRevenue || 0), 0);
  const novemberRevenue = aggregators.reduce((sum, agg) => sum + (agg.novemberRevenue || 0), 0);
  const decemberRevenue = aggregators.reduce((sum, agg) => sum + (agg.decemberRevenue || 0), 0);
  const dashboardMetrics = {
    totalKekesAssigned: 250,
    kekesPickedUp: 73,
    kekesActivelyDeployed: 68,
    kekesYetToPickup: 177, // 250 - 73 = 177
    totalRevenue: totalRevenue,
    totalWeeklyCollection: augustRevenue, // August revenue
    cardPaymentRatio: 0.32,
    totalRebatesIssued: 0,
    akupayCommission: 0,
    picngSettlement: 0,
    picngRevenue: totalRevenue * 0.1, // 10% of total revenue
  };

  // Chart data
  // Target: ₦52,900 per keke × 68 deployed kekes = ₦3,597,200 weekly target
  const weeklyTarget = 52900 * dashboardMetrics.kekesActivelyDeployed;
  const weeklyCollectionData = [
    { date: "Feb 2025", collection: 0, target: weeklyTarget }, // Project started, no revenue
    { date: "Mar 2025", collection: 180000, target: weeklyTarget }, // First revenue
    { date: "Apr 2025", collection: 720000, target: weeklyTarget },
    { date: "May 2025", collection: 652000, target: weeklyTarget },
    { date: "Jun 2025", collection: 542000, target: weeklyTarget },
    { date: "Jul 2025", collection: 0, target: weeklyTarget }, // No revenue collected
    { date: "Aug 2025", collection: augustRevenue, target: weeklyTarget },
    { date: "Sep 2025", collection: septemberRevenue, target: weeklyTarget },
    { date: "Oct 2025", collection: octoberRevenue, target: weeklyTarget },
    { date: "Nov 2025", collection: novemberRevenue, target: weeklyTarget },
    { date: "Dec 2025", collection: decemberRevenue, target: weeklyTarget }, // Current month
  ];

  const paymentMethodData = [
    { name: "Card Payments", value: 79, color: "#10B981" },
    { name: "Cash Payments", value: 21, color: "#F59E0B" },
  ];

  const cooperativePerformanceData = aggregators.map((aggregator) => ({
    cooperative:
      aggregator.name.length > 15
        ? aggregator.name.substring(0, 15) + "..."
        : aggregator.name,
    revenue: aggregator.totalRevenue || 0,
    kekeCount: aggregator.kekesDeployed,
    assigned: aggregator.kekesAssigned,
  }));

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
            formData.chassisNumber || (editingItem as KekeAsset).chassisNumber
          }`,
        });
      } else {
        dispatch(addKekeAsset(formData as Omit<KekeAsset, "id">));
        toast.success("Keke asset created successfully!", {
          description: `Added ${formData.chassisNumber}`,
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
  //   const handleExportData = async () => {
  //     setIsOperationLoading(true);

  //     try {
  //       // Simulate processing time
  //       await new Promise((resolve) => setTimeout(resolve, 500));

  //       const exportData = {
  //         exportDate: new Date().toISOString(),
  //         exportedBy: user?.username,
  //         summary: {
  //           totalKekesAssigned: dashboardMetrics.totalKekesAssigned,
  //           kekesActivelyDeployed: dashboardMetrics.kekesActivelyDeployed,
  //           totalWeeklyCollection: dashboardMetrics.totalWeeklyCollection,
  //           cardPaymentRatio: dashboardMetrics.cardPaymentRatio,
  //           totalRebatesIssued: dashboardMetrics.totalRebatesIssued,
  //         },
  //         kekeAssets: kekeAssets.map((keke) => ({
  //           id: keke.id,
  //           chassisNumber: keke.chassisNumber,
  //           aggregator: keke.aggregator,
  //           driver: keke.driver,
  //           location: keke.location,
  //           status: keke.status,
  //           weeklyRevenue: keke.weeklyRevenue,
  //           cardPaymentRatio: keke.cardPaymentRatio,
  //           deploymentDate: keke.deploymentDate,
  //         })),
  //         aggregators: aggregators.map((agg) => ({
  //           id: agg.id,
  //           name: agg.name,
  //           kekesAssigned: agg.kekesAssigned,
  //           kekesDeployed: agg.kekesDeployed,
  //           avgWeeklyCollection: agg.avgWeeklyCollection,
  //           cardPaymentRatio: agg.cardPaymentRatio,
  //         })),
  //         drivers: drivers.map((driver) => ({
  //           id: driver.id,
  //           name: driver.name,
  //           chassisNumber: driver.chassisNumber,
  //           kekeId: driver.kekeId,
  //           licenseExpiry: driver.licenseExpiry,
  //           kycStatus: driver.kycStatus,
  //           appUsage: driver.appUsage,
  //         })),
  //       };

  //       // Convert to CSV format
  //       const csvContent = generateCSV(exportData);

  //       // Create and download file
  //       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //       const link = document.createElement("a");
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute("href", url);
  //       link.setAttribute(
  //         "download",
  //         `PICNG_Dashboard_Export_${new Date().toISOString().split("T")[0]}.csv`
  //       );
  //       link.style.visibility = "hidden";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       // Show success message
  //       toast.success("Data exported successfully!", {
  //         description: `Exported to PICNG_Dashboard_Export_${
  //           new Date().toISOString().split("T")[0]
  //         }.csv`,
  //       });
  //     } catch (error) {
  //       console.error("Export failed:", error);
  //       toast.error("Failed to export data", {
  //         description:
  //           "Please try again or contact support if the issue persists.",
  //       });
  //     } finally {
  //       setIsOperationLoading(false);
  //     }
  //   };

  //   // Generate CSV from data
  //   const generateCSV = (data: any) => {
  //     let csv = "PICNG Dashboard Export\n";
  //     csv += `Export Date,${data.exportDate}\n`;
  //     csv += `Exported By,${data.exportedBy}\n\n`;

  //     // Summary section
  //     csv += "SUMMARY\n";
  //     csv += "Metric,Value\n";
  //     csv += `Total Kekes Assigned,${data.summary.totalKekesAssigned}\n`;
  //     csv += `Kekes Actively Deployed,${data.summary.kekesActivelyDeployed}\n`;
  //     csv += `Total Daily Collection,₦${data.summary.totalDailyCollection}\n`;
  //     csv += `Card Payment Ratio,${(data.summary.cardPaymentRatio * 100).toFixed(
  //       1
  //     )}%\n`;
  //     csv += `Total Rebates Issued,₦${data.summary.totalRebatesIssued}\n\n`;

  //     // Keke Assets section
  //     csv += "KEKE ASSETS\n";
  //     csv +=
  //       "ID,Registration Number,Aggregator,Driver,Location,Status,Daily Revenue,Card Payment Ratio,Deployment Date\n";
  //     data.kekeAssets.forEach((keke: any) => {
  //       csv += `${keke.id},${keke.chassisNumber},${keke.aggregator},${
  //         keke.driver
  //       },${keke.location},${keke.status},₦${keke.dailyRevenue},${(
  //         keke.cardPaymentRatio * 100
  //       ).toFixed(1)}%,${keke.deploymentDate}\n`;
  //     });
  //     csv += "\n";

  //     // Aggregators section
  //     csv += "AGGREGATORS\n";
  //     csv +=
  //       "ID,Name,Kekes Assigned,Kekes Deployed,Avg Daily Collection,Card Payment Ratio\n";
  //     data.aggregators.forEach((agg: any) => {
  //       csv += `${agg.id},${agg.name},${agg.kekesAssigned},${
  //         agg.kekesDeployed
  //       },₦${agg.avgWeeklyCollection || 0},${(agg.cardPaymentRatio * 100).toFixed(
  //         1
  //       )}%\n`;
  //     });
  //     csv += "\n";

  //     // Drivers section
  //     csv += "DRIVERS\n";
  //     csv += "ID,Name,Chassis Number,Keke ID,License Expiry,KYC Status,App Usage\n";
  //     data.drivers.forEach((driver: any) => {
  //       csv += `${driver.id},${driver.name},${driver.chassisNumber},${

  //         driver.kekeId || "Not Assigned"
  //       },${driver.licenseExpiry},${driver.kycStatus},${driver.appUsage}\n`;
  //     });

  //     return csv;
  //   };

  // Filter and sort functions
  const filteredKekeAssets = kekeAssets
    .filter((keke) => {
      const matchesSearch =
        keke.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keke.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keke.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAggregator =
        !selectedAggregator || keke.aggregator === selectedAggregator;
      const matchesStatus = !selectedStatus || keke.status === selectedStatus;
      return matchesSearch && matchesAggregator && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by status: Active first, then Maintenance, then Inactive
      const statusOrder = { Active: 1, Maintenance: 2, Inactive: 3 };
      return (
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder]
      );
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
              {/* <div className="flex items-center space-x-4">
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
              </div> */}
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
              cooperativePerformanceData={cooperativePerformanceData}
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
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
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
                    <button
                      onClick={() => window.open("https://www.tramigocloud.com/live-tracking", "_blank")}
                      className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-80"
                      style={{
                        backgroundColor: "red",
                      }}
                    >
                      <span>Track Assets</span>
                    </button>
                  </div>
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
                    key: "chassisNumber",
                    header: "Chassis Number",
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
                        <h3 className="text-lg font-bold text-gray-900  line-clamp-1">
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
                        <span
                          className={`text-sm font-bold ${
                            aggregator.kekesDeployed /
                              aggregator.kekesAssigned >=
                            0.8
                              ? "text-green-600"
                              : aggregator.kekesDeployed /
                                  aggregator.kekesAssigned >=
                                0.6
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {(
                            (aggregator.kekesDeployed /
                              aggregator.kekesAssigned) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">
                          Avg Weekly Collection
                        </span>
                        <span className="text-sm font-bold text-black">
                          ₦
                          {(
                            aggregator.avgWeeklyCollection || 0
                          ).toLocaleString()}
                        </span>
                      </div> */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Total Revenue
                        </span>
                        <span className="text-sm font-bold text-black">
                          ₦{(aggregator.totalRevenue || 0).toLocaleString()}
                        </span>
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
                            width: `${
                              (aggregator.kekesDeployed /
                                aggregator.kekesAssigned) *
                              100
                            }%`,
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

          {/* Financial Tab */}
          {activeTab === "financial" && (
            <div className="space-y-6">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Total Collection"
                  value={`₦${dashboardMetrics.totalRevenue.toLocaleString()}`}
                  icon={DollarSign}
                  color="emerald"
                />
                <MetricCard
                  title="Settlements"
                  breakdown={[
                    {
                      label: "PICNG",
                      value: `₦${0}`,
                    },
                    {
                      label: "Aggregator",
                      value: `₦${0}`,
                    },
                    {
                      label: "Aku",
                      value: `₦${0}`,
                    },
                  ]}
                  icon={BanknoteIcon}
                  color="blue"
                />
                <MetricCard
                  title="Project Loan"
                  breakdown={[
                    {
                      label: "Principal",
                      value: `-₦${(125000000).toLocaleString()}`,
                    },
                    {
                      label: "Interest",
                      value: `-₦${(50000000).toLocaleString()}`,
                    },
                  ]}
                  icon={CreditCard}
                  trend={3.7}
                  color="black"
                />
              </div>

              {/* Cooperative Financial Summary Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Cooperative Revenue Summary
                  </h3>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="march">March 2025</option>
                    <option value="april">April 2025</option>
                    <option value="may">May 2025</option>
                    <option value="june">June 2025</option>
                    <option value="july">July 2025</option>
                    <option value="august">August 2025</option>
                    <option value="september">September 2025</option>
                    <option value="october">October 2025</option>
                    <option value="november">November 2025</option>
                    <option value="december">December 2025</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cooperative Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aku Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kekes Deployed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {aggregators.map((aggregator) => {
                        const getMonthRevenue = (month: string) => {
                          switch (month) {
                            case "march":
                              return aggregator.marchRevenue || 0;
                            case "april":
                              return aggregator.aprilRevenue || 0;
                            case "may":
                              return aggregator.mayRevenue || 0;
                            case "june":
                              return aggregator.juneRevenue || 0;
                            case "july":
                              return aggregator.julyRevenue || 0;
                            case "august":
                              return aggregator.augustRevenue || 0;
                            case "september":
                              return aggregator.septemberRevenue || 0;
                            case "october":
                              return aggregator.octoberRevenue || 0;
                            case "november":
                              return aggregator.novemberRevenue || 0;
                            case "december":
                              return aggregator.decemberRevenue || 0;
                            default:
                              return 0;
                          }
                        };

                        const monthRevenue = getMonthRevenue(selectedMonth);

                        return (
                          <tr key={aggregator.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {aggregator.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ₦{monthRevenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦0
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {aggregator.kekesDeployed}
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

              <Table
                data={drivers}
                columns={[
                  {
                    key: "id",
                    header: "Driver ID",
                    sortable: true,
                    className: "font-medium",
                  },
                  {
                    key: "name",
                    header: "Name",
                    sortable: true,
                  },
                  {
                    key: "chassisNumber",
                    header: "Chassis Number",
                    sortable: true,
                  },
                  {
                    key: "kekeId",
                    header: "Assigned Keke",
                    sortable: true,
                    render: (driver) => driver.kekeId || "Not Assigned",
                  },
                  {
                    key: "licenseExpiry",
                    header: "License Expiry",
                    sortable: true,
                    render: (driver) => {
                      const isLicenseExpiring =
                        new Date(driver.licenseExpiry) <=
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      return (
                        <div className="flex items-center">
                          {driver.licenseExpiry}
                          {isLicenseExpiring && (
                            <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    key: "kycStatus",
                    header: "KYC Status",
                    sortable: true,
                    render: (driver) => (
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
                    ),
                  },
                  {
                    key: "appUsage",
                    header: "App Usage",
                    sortable: true,
                    render: (driver) => (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          driver.appUsage === "Active"
                            ? "bg-green-100 text-green-800"
                            : driver.appUsage === "Unused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {driver.appUsage}
                      </span>
                    ),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (driver) => (
                      <div className="flex items-center space-x-2">
                        {canEdit && (
                          <>
                            <button
                              onClick={() => openModal("driver", driver)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
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
                searchPlaceholder="Search drivers..."
                emptyMessage="No drivers found"
              />
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
