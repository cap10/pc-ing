/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Users,
  Truck,
  CreditCard,
  TrendingUp,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { customTooltipStyle } from "../../utils/chartConfig";

const PICNGDashboard = () => {
  // State for different data entities
  const [kekeAssets, setKekeAssets] = useState([
    {
      id: "KK001",
      registrationNumber: "ABC-123-XY",
      aggregator: "City Riders Coop",
      driver: "Ahmed Ibrahim",
      location: "Victoria Island",
      status: "Active",
      weeklyRevenue: 8500,
      cardPaymentRatio: 0.75,
      rebatesIssued: 425,
      deploymentDate: "2025-06-15",
    },
    {
      id: "KK002",
      registrationNumber: "DEF-456-ZW",
      aggregator: "Metro Transport",
      driver: "Chidi Okafor",
      location: "Ikeja",
      status: "Active",
      weeklyRevenue: 12000,
      cardPaymentRatio: 0.82,
      rebatesIssued: 600,
      deploymentDate: "2025-06-10",
    },
    {
      id: "KK003",
      registrationNumber: "GHI-789-UV",
      aggregator: "City Riders Coop",
      driver: "Fatima Hassan",
      location: "Surulere",
      status: "Maintenance",
      weeklyRevenue: 0,
      cardPaymentRatio: 0,
      rebatesIssued: 0,
      deploymentDate: "2025-06-20",
    },
  ]);

  const [aggregators, setAggregators] = useState([
    {
      id: "AGG001",
      name: "City Riders Coop",
      kekesAssigned: 15,
      kekesDeployed: 12,
      avgWeeklyCollection: 9500,
      cardPaymentRatio: 0.78,
    },
    {
      id: "AGG002",
      name: "Metro Transport",
      kekesAssigned: 10,
      kekesDeployed: 8,
      avgWeeklyCollection: 11200,
      cardPaymentRatio: 0.85,
    },
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: "DRV001",
      name: "Ahmed Ibrahim",
      phone: "+234-801-234-5678",
      kekeId: "KK001",
      licenseExpiry: "2025-12-15",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV002",
      name: "Chidi Okafor",
      phone: "+234-802-345-6789",
      kekeId: "KK002",
      licenseExpiry: "2025-11-20",
      kycStatus: "Complete",
      appUsage: "Active",
    },
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm] = useState("");
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
  const openModal = (type: string, item: any = null) => {
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
  const handleSaveKeke = (formData: any) => {
    if (editingItem) {
      setKekeAssets((prev) =>
        prev.map((keke) =>
          keke.id === (editingItem as any).id ? { ...keke, ...formData } : keke
        )
      );
    } else {
      const newKeke = {
        id: `KK${String(kekeAssets.length + 1).padStart(3, "0")}`,
        ...formData,
        weeklyRevenue: 0,
        cardPaymentRatio: 0,
        rebatesIssued: 0,
      };
      setKekeAssets((prev) => [...prev, newKeke]);
    }
    closeModal();
  };

  const handleDeleteKeke = (id: string) => {
    setKekeAssets((prev) => prev.filter((keke) => keke.id !== id));
  };

  // CRUD operations for Aggregators
  const handleSaveAggregator = (formData: any) => {
    if (editingItem) {
      setAggregators((prev) =>
        prev.map((agg) =>
          agg.id === (editingItem as any).id ? { ...agg, ...formData } : agg
        )
      );
    } else {
      const newAggregator = {
        id: `AGG${String(aggregators.length + 1).padStart(3, "0")}`,
        ...formData,
        kekesDeployed: 0,
        avgWeeklyCollection: 0,
        cardPaymentRatio: 0,
      };
      setAggregators((prev) => [...prev, newAggregator]);
    }
    closeModal();
  };

  const handleDeleteAggregator = (id: string) => {
    setAggregators((prev) => prev.filter((agg) => agg.id !== id));
  };

  // CRUD operations for Drivers
  const handleSaveDriver = (formData: any) => {
    if (editingItem) {
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === (editingItem as any).id ? { ...driver, ...formData } : driver
        )
      );
    } else {
      const newDriver = {
        id: `DRV${String(drivers.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setDrivers((prev) => [...prev, newDriver]);
    }
    closeModal();
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
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

  // Reusable components
  const MetricCard = ({ title, value, icon: Icon, trend, color = "blue" }: { title: any; value: any; icon: any; trend?: any; color?: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              } flex items-center mt-1`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? "+" : ""}
              {trend}%
            </p>
          )}
        </div>
        <Icon className={`w-12 h-12 text-${color}-600`} />
      </div>
    </div>
  );

  const Modal = ({ children }: { children: any }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
        {children}
      </div>
    </div>
  );

  // Form components
  const KekeForm = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        registrationNumber: "",
        aggregator: "",
        driver: "",
        location: "",
        status: "Active",
        deploymentDate: new Date().toISOString().split("T")[0],
      }
    );

    return (
      <Modal>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingItem ? "Edit Keke Asset" : "Add New Keke Asset"}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aggregator
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.aggregator}
              onChange={(e) =>
                setFormData({ ...formData, aggregator: e.target.value })
              }
            >
              <option value="">Select Aggregator</option>
              {aggregators.map((agg) => (
                <option key={agg.id} value={agg.name}>
                  {agg.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.driver}
              onChange={(e) =>
                setFormData({ ...formData, driver: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveKeke(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingItem ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    );
  };

  const AggregatorForm = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        name: "",
        kekesAssigned: 0,
      }
    );

    return (
      <Modal>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingItem ? "Edit Aggregator" : "Add New Aggregator"}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aggregator Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keke Assets Assigned
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.kekesAssigned}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kekesAssigned: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveAggregator(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingItem ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    );
  };

  const DriverForm = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        name: "",
        phone: "",
        kekeId: "",
        licenseExpiry: "",
        kycStatus: "Pending",
        appUsage: "Inactive",
      }
    );

    return (
      <Modal>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingItem ? "Edit Driver" : "Add New Driver"}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Keke ID
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.kekeId}
              onChange={(e) =>
                setFormData({ ...formData, kekeId: e.target.value })
              }
            >
              <option value="">Select Keke</option>
              {kekeAssets.map((keke) => (
                <option key={keke.id} value={keke.id}>
                  {keke.id} - {keke.registrationNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.licenseExpiry}
              onChange={(e) =>
                setFormData({ ...formData, licenseExpiry: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KYC Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.kycStatus}
              onChange={(e) =>
                setFormData({ ...formData, kycStatus: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveDriver(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingItem ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                PICNG Asset & Payment Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Powered by Akupay • July 2025
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: Activity },
              { id: "assets", name: "Asset Management", icon: Truck },
              { id: "aggregators", name: "Aggregators", icon: Users },
              { id: "transactions", name: "Transactions", icon: CreditCard },
              { id: "financial", name: "Financial", icon: DollarSign },
              { id: "drivers", name: "Drivers", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Kekes Assigned"
                value={dashboardMetrics.totalKekesAssigned}
                icon={Truck}
                trend={5.2}
                color="blue"
              />
              <MetricCard
                title="Actively Deployed"
                value={dashboardMetrics.kekesActivelyDeployed}
                icon={CheckCircle}
                trend={2.1}
                color="green"
              />
              <MetricCard
                title="Weekly Collection"
                value={`₦${dashboardMetrics.totalWeeklyCollection.toLocaleString()}`}
                icon={DollarSign}
                trend={8.3}
                color="emerald"
              />
              <MetricCard
                title="Card Payment Ratio"
                value={`${(dashboardMetrics.cardPaymentRatio * 100).toFixed(
                  1
                )}%`}
                icon={CreditCard}
                trend={3.7}
                color="purple"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Collections Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Collections vs Target
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₦${value.toLocaleString()}`, ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="collection"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#10B981"
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Methods Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Payment Methods Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Performance */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">
                Location Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `₦${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Keke Count",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
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
                <button
                  onClick={() => openModal("keke")}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Keke Asset</span>
                </button>
              </div>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keke ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aggregator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weekly Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Card Ratio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKekeAssets.map((keke) => (
                      <tr key={keke.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {keke.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {keke.registrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {keke.driver}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {keke.aggregator}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {keke.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₦{(keke.weeklyRevenue || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(keke.cardPaymentRatio * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal("keke", keke)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteKeke(keke.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Aggregators Tab */}
        {activeTab === "aggregators" && (
          <div className="space-y-6">
            <div className="flex justify-end items-center">
              <button
                onClick={() => openModal("aggregator")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Aggregator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aggregators.map((aggregator) => (
                <div
                  key={aggregator.id}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {aggregator.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal("aggregator", aggregator)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAggregator(aggregator.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Keke Assets Assigned:
                      </span>
                      <span className="text-sm font-medium">
                        {aggregator.kekesAssigned}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Deployed:</span>
                      <span className="text-sm font-medium">
                        {aggregator.kekesDeployed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Deployment Rate:
                      </span>
                      <span className="text-sm font-medium">
                        {(
                          (aggregator.kekesDeployed /
                            aggregator.kekesAssigned) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Avg Weekly Collection:
                      </span>
                      <span className="text-sm font-medium">
                        ₦{(aggregator.avgWeeklyCollection || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Card Payment Ratio:
                      </span>
                      <span className="text-sm font-medium">
                        {(aggregator.cardPaymentRatio * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (aggregator.kekesDeployed /
                              aggregator.kekesAssigned) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Deployment Progress
                    </p>
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
                title="Total Collection Today"
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
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Collection Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₦${value.toLocaleString()}`, ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="collection"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10B981"
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Location Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip
                      {...customTooltipStyle}
                      formatter={(value) => [
                        `₦${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
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
                title="Total Collection"
                value={`₦${dashboardMetrics.totalWeeklyCollection.toLocaleString()}`}
                icon={DollarSign}
                trend={0}
                color="emerald"
              />
              <MetricCard
                title="Akupay Commission"
                value={`₦${dashboardMetrics.akupayCommission.toLocaleString()}`}
                icon={CreditCard}
                trend={0}
                color="blue"
              />
              <MetricCard
                title="Rebates Issued"
                value={`₦${dashboardMetrics.totalRebatesIssued.toLocaleString()}`}
                icon={TrendingUp}
                trend={0}
                color="purple"
              />
              <MetricCard
                title="PICNG Settlement"
                value={`₦${dashboardMetrics.picngSettlement.toLocaleString()}`}
                icon={CheckCircle}
                trend={0}
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
                        (keke.weeklyRevenue || 0) - akupayEarnings - (keke.rebatesIssued || 0);

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
              <button
                onClick={() => openModal("driver")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Driver</span>
              </button>
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
                              <button
                                onClick={() => openModal("driver", driver)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

      {/* Modals */}
      {showModal && modalType === "keke" && <KekeForm />}
      {showModal && modalType === "aggregator" && <AggregatorForm />}
      {showModal && modalType === "driver" && <DriverForm />}
    </div>
  );
};

export default PICNGDashboard;
