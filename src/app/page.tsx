'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store/hooks';
import { checkAuth, performLogout } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import {
    Users,
    Truck,
    CreditCard,
    TrendingUp,
    MapPin,
    Plus,
    Edit,
    Trash2,
    Search,
    Download,
    Eye,
    DollarSign,
    Activity,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

// Import components
import Sidenav from '../components/ui/Sidenav';
import MetricCard from '../components/ui/MetricCard';
import OverviewTab from '../components/tabs/OverviewTab';
import KekeForm from '../components/forms/KekeForm';
import AggregatorForm from '../components/forms/AggregatorForm';
import DriverForm from '../components/forms/DriverForm';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const PICNGDashboard = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, canEdit, user } = useAuth();
    
    // State for mobile sidenav
    const [isSidenavOpen, setIsSidenavOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Loading states for operations
    const [isOperationLoading, setIsOperationLoading] = useState(false);
    
    // Confirmation modal states
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        itemType: ''
    });
    
    // State for different data entities
    const [kekeAssets, setKekeAssets] = useState([
        {
            id: 'KK001',
            registrationNumber: 'ABC-123-XY',
            aggregator: 'City Riders Coop',
            driver: 'Ahmed Ibrahim',
            location: 'Victoria Island',
            status: 'Active',
            dailyRevenue: 8500,
            cardPaymentRatio: 0.75,
            rebatesIssued: 425,
            deploymentDate: '2025-06-15'
        },
        {
            id: 'KK002',
            registrationNumber: 'DEF-456-ZW',
            aggregator: 'Metro Transport',
            driver: 'Chidi Okafor',
            location: 'Ikeja',
            status: 'Active',
            dailyRevenue: 12000,
            cardPaymentRatio: 0.82,
            rebatesIssued: 600,
            deploymentDate: '2025-06-10'
        },
        {
            id: 'KK003',
            registrationNumber: 'GHI-789-UV',
            aggregator: 'City Riders Coop',
            driver: 'Fatima Hassan',
            location: 'Surulere',
            status: 'Maintenance',
            dailyRevenue: 0,
            cardPaymentRatio: 0,
            rebatesIssued: 0,
            deploymentDate: '2025-06-20'
        }
    ]);

    const [aggregators, setAggregators] = useState([
        {
            id: 'AGG001',
            name: 'City Riders Coop',
            kekesAssigned: 15,
            kekesDeployed: 12,
            avgDailyCollection: 9500,
            cardPaymentRatio: 0.78
        },
        {
            id: 'AGG002',
            name: 'Metro Transport',
            kekesAssigned: 10,
            kekesDeployed: 8,
            avgDailyCollection: 11200,
            cardPaymentRatio: 0.85
        }
    ]);

    const [drivers, setDrivers] = useState([
        {
            id: 'DRV001',
            name: 'Ahmed Ibrahim',
            phone: '+234-801-234-5678',
            kekeId: 'KK001',
            licenseExpiry: '2025-12-15',
            kycStatus: 'Complete',
            appUsage: 'Active'
        },
        {
            id: 'DRV002',
            name: 'Chidi Okafor',
            phone: '+234-802-345-6789',
            kekeId: 'KK002',
            licenseExpiry: '2025-11-20',
            kycStatus: 'Complete',
            appUsage: 'Active'
        }
    ]);

    // UI State
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAggregator, setSelectedAggregator] = useState('');

    // Dashboard metrics
    const dashboardMetrics = {
        totalKekesAssigned: 25,
        kekesPickedUp: 20,
        kekesActivelyDeployed: 18,
        kekesYetToPickup: 5,
        totalDailyCollection: 187500,
        cardPaymentRatio: 0.79,
        totalRebatesIssued: 9375,
        akupayCommission: 18750,
        picngSettlement: 159375
    };

    // Chart data
    const dailyCollectionData = [
        { date: 'Mon', collection: 175000, target: 180000 },
        { date: 'Tue', collection: 182000, target: 180000 },
        { date: 'Wed', collection: 178000, target: 180000 },
        { date: 'Thu', collection: 185000, target: 180000 },
        { date: 'Fri', collection: 187500, target: 180000 },
        { date: 'Sat', collection: 195000, target: 180000 },
        { date: 'Sun', collection: 172000, target: 180000 }
    ];

    const paymentMethodData = [
        { name: 'Card Payments', value: 79, color: '#10B981' },
        { name: 'Cash Payments', value: 21, color: '#F59E0B' }
    ];

    const locationPerformanceData = [
        { location: 'Victoria Island', revenue: 45000, kekeCount: 6 },
        { location: 'Ikeja', revenue: 38000, kekeCount: 5 },
        { location: 'Surulere', revenue: 32000, kekeCount: 4 },
        { location: 'Yaba', revenue: 28000, kekeCount: 3 }
    ];

    // Modal management
    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setModalType('');
    };

    // CRUD operations for Keke Assets
    const handleSaveKeke = async (formData) => {
        setIsOperationLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingItem) {
                setKekeAssets(prev => prev.map(keke =>
                    keke.id === editingItem.id ? { ...keke, ...formData } : keke
                ));
                toast.success('Keke asset updated successfully!', {
                    description: `Updated ${formData.registrationNumber || editingItem.registrationNumber}`
                });
            } else {
                const newKeke = {
                    id: `KK${String(kekeAssets.length + 1).padStart(3, '0')}`,
                    ...formData,
                    dailyRevenue: 0,
                    cardPaymentRatio: 0,
                    rebatesIssued: 0
                };
                setKekeAssets(prev => [...prev, newKeke]);
                toast.success('Keke asset created successfully!', {
                    description: `Added ${formData.registrationNumber}`
                });
            }
            closeModal();
        } catch (error) {
            console.error('Save operation failed:', error);
            toast.error('Operation failed', {
                description: 'Please try again or contact support.'
            });
        } finally {
            setIsOperationLoading(false);
        }
    };

    const handleDeleteKeke = (id) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Keke Asset',
            message: 'Are you sure you want to delete this Keke asset? This action cannot be undone.',
            onConfirm: async () => {
                setIsOperationLoading(true);
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setKekeAssets(prev => prev.filter(keke => keke.id !== id));
                toast.success('Keke asset deleted successfully!');
                setIsOperationLoading(false);
            },
            itemType: 'keke'
        });
    };

    // CRUD operations for Aggregators
    const handleSaveAggregator = async (formData) => {
        setIsOperationLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingItem) {
                setAggregators(prev => prev.map(agg =>
                    agg.id === editingItem.id ? { ...agg, ...formData } : agg
                ));
                toast.success('Aggregator updated successfully!', {
                    description: `Updated ${formData.name || editingItem.name}`
                });
            } else {
                const newAggregator = {
                    id: `AGG${String(aggregators.length + 1).padStart(3, '0')}`,
                    ...formData,
                    kekesDeployed: 0,
                    avgDailyCollection: 0,
                    cardPaymentRatio: 0
                };
                setAggregators(prev => [...prev, newAggregator]);
                toast.success('Aggregator created successfully!', {
                    description: `Added ${formData.name}`
                });
            }
            closeModal();
        } catch (error) {
            console.error('Save operation failed:', error);
            toast.error('Operation failed', {
                description: 'Please try again or contact support.'
            });
        } finally {
            setIsOperationLoading(false);
        }
    };

    const handleDeleteAggregator = (id) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Aggregator',
            message: 'Are you sure you want to delete this aggregator? This action cannot be undone.',
            onConfirm: async () => {
                setIsOperationLoading(true);
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setAggregators(prev => prev.filter(agg => agg.id !== id));
                toast.success('Aggregator deleted successfully!');
                setIsOperationLoading(false);
            },
            itemType: 'aggregator'
        });
    };

    // CRUD operations for Drivers
    const handleSaveDriver = async (formData) => {
        setIsOperationLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingItem) {
                setDrivers(prev => prev.map(driver =>
                    driver.id === editingItem.id ? { ...driver, ...formData } : driver
                ));
                toast.success('Driver updated successfully!', {
                    description: `Updated ${formData.name || editingItem.name}`
                });
            } else {
                const newDriver = {
                    id: `DRV${String(drivers.length + 1).padStart(3, '0')}`,
                    ...formData
                };
                setDrivers(prev => [...prev, newDriver]);
                toast.success('Driver created successfully!', {
                    description: `Added ${formData.name}`
                });
            }
            closeModal();
        } catch (error) {
            console.error('Save operation failed:', error);
            toast.error('Operation failed', {
                description: 'Please try again or contact support.'
            });
        } finally {
            setIsOperationLoading(false);
        }
    };

    const handleDeleteDriver = (id) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Delete Driver',
            message: 'Are you sure you want to delete this driver? This action cannot be undone.',
            onConfirm: async () => {
                setIsOperationLoading(true);
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setDrivers(prev => prev.filter(driver => driver.id !== id));
                toast.success('Driver deleted successfully!');
                setIsOperationLoading(false);
            },
            itemType: 'driver'
        });
    };

    // Authentication check
    useEffect(() => {
        dispatch(checkAuth());
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Handle logout
    const handleLogout = () => {
        dispatch(performLogout());
        router.push('/login');
    };

    // Show loading screen
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0B4F26' }}></div>
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
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const exportData = {
            exportDate: new Date().toISOString(),
            exportedBy: user?.username,
            summary: {
                totalKekesAssigned: dashboardMetrics.totalKekesAssigned,
                kekesActivelyDeployed: dashboardMetrics.kekesActivelyDeployed,
                totalDailyCollection: dashboardMetrics.totalDailyCollection,
                cardPaymentRatio: dashboardMetrics.cardPaymentRatio,
                totalRebatesIssued: dashboardMetrics.totalRebatesIssued
            },
            kekeAssets: kekeAssets.map(keke => ({
                id: keke.id,
                registrationNumber: keke.registrationNumber,
                aggregator: keke.aggregator,
                driver: keke.driver,
                location: keke.location,
                status: keke.status,
                dailyRevenue: keke.dailyRevenue,
                cardPaymentRatio: keke.cardPaymentRatio,
                deploymentDate: keke.deploymentDate
            })),
            aggregators: aggregators.map(agg => ({
                id: agg.id,
                name: agg.name,
                kekesAssigned: agg.kekesAssigned,
                kekesDeployed: agg.kekesDeployed,
                avgDailyCollection: agg.avgDailyCollection,
                cardPaymentRatio: agg.cardPaymentRatio
            })),
            drivers: drivers.map(driver => ({
                id: driver.id,
                name: driver.name,
                phone: driver.phone,
                kekeId: driver.kekeId,
                licenseExpiry: driver.licenseExpiry,
                kycStatus: driver.kycStatus,
                appUsage: driver.appUsage
            }))
        };

        // Convert to CSV format
        const csvContent = generateCSV(exportData);
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `PICNG_Dashboard_Export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        toast.success('Data exported successfully!', {
            description: `Exported to PICNG_Dashboard_Export_${new Date().toISOString().split('T')[0]}.csv`
        });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export data', {
                description: 'Please try again or contact support if the issue persists.'
            });
        } finally {
            setIsOperationLoading(false);
        }
    };

    // Generate CSV from data
    const generateCSV = (data: any) => {
        let csv = 'PICNG Dashboard Export\n';
        csv += `Export Date,${data.exportDate}\n`;
        csv += `Exported By,${data.exportedBy}\n\n`;
        
        // Summary section
        csv += 'SUMMARY\n';
        csv += 'Metric,Value\n';
        csv += `Total Kekes Assigned,${data.summary.totalKekesAssigned}\n`;
        csv += `Kekes Actively Deployed,${data.summary.kekesActivelyDeployed}\n`;
        csv += `Total Daily Collection,₦${data.summary.totalDailyCollection}\n`;
        csv += `Card Payment Ratio,${(data.summary.cardPaymentRatio * 100).toFixed(1)}%\n`;
        csv += `Total Rebates Issued,₦${data.summary.totalRebatesIssued}\n\n`;
        
        // Keke Assets section
        csv += 'KEKE ASSETS\n';
        csv += 'ID,Registration Number,Aggregator,Driver,Location,Status,Daily Revenue,Card Payment Ratio,Deployment Date\n';
        data.kekeAssets.forEach((keke: any) => {
            csv += `${keke.id},${keke.registrationNumber},${keke.aggregator},${keke.driver},${keke.location},${keke.status},₦${keke.dailyRevenue},${(keke.cardPaymentRatio * 100).toFixed(1)}%,${keke.deploymentDate}\n`;
        });
        csv += '\n';
        
        // Aggregators section
        csv += 'AGGREGATORS\n';
        csv += 'ID,Name,Kekes Assigned,Kekes Deployed,Avg Daily Collection,Card Payment Ratio\n';
        data.aggregators.forEach((agg: any) => {
            csv += `${agg.id},${agg.name},${agg.kekesAssigned},${agg.kekesDeployed},₦${agg.avgDailyCollection},${(agg.cardPaymentRatio * 100).toFixed(1)}%\n`;
        });
        csv += '\n';
        
        // Drivers section
        csv += 'DRIVERS\n';
        csv += 'ID,Name,Phone,Keke ID,License Expiry,KYC Status,App Usage\n';
        data.drivers.forEach((driver: any) => {
            csv += `${driver.id},${driver.name},${driver.phone},${driver.kekeId || 'Not Assigned'},${driver.licenseExpiry},${driver.kycStatus},${driver.appUsage}\n`;
        });
        
        return csv;
    };

    // Filter functions
    const filteredKekeAssets = kekeAssets.filter(keke => {
        const matchesSearch = keke.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            keke.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
            keke.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAggregator = !selectedAggregator || keke.aggregator === selectedAggregator;
        return matchesSearch && matchesAggregator;
    });


    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidenav Component */}
            <Sidenav 
                isSidenavOpen={isSidenavOpen}
                setIsSidenavOpen={setIsSidenavOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">PICNG Asset & Payment Dashboard</h1>
                                    <p className="text-sm text-gray-600">
                                        Powered by Akupay • July 2025 • {user?.username} ({user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'})
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={handleExportData}
                                    disabled={isOperationLoading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isOperationLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    <span className="hidden sm:inline">
                                        {isOperationLoading ? 'Exporting...' : 'Export Data'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <OverviewTab 
                        dashboardMetrics={dashboardMetrics}
                        dailyCollectionData={dailyCollectionData}
                        paymentMethodData={paymentMethodData}
                        locationPerformanceData={locationPerformanceData}
                    />
                )}

                {/* Asset Management Tab */}
                {activeTab === 'assets' && (
                    <div className="space-y-6">
                        {/* Filters and Actions */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search assets..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedAggregator}
                                        onChange={(e) => setSelectedAggregator(e.target.value)}
                                    >
                                        <option value="">All Aggregators</option>
                                        {aggregators.map(agg => (
                                            <option key={agg.id} value={agg.name}>{agg.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {canEdit && (
                                    <button
                                        onClick={() => openModal('keke')}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Keke Asset</span>
                                    </button>
                                )}
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
                                            Daily Revenue
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              keke.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : keke.status === 'Maintenance'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                          }`}>
                            {keke.status}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₦{keke.dailyRevenue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(keke.cardPaymentRatio * 100).toFixed(1)}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {canEdit && (
                                                        <>
                                                            <button
                                                                onClick={() => openModal('keke', keke)}
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
                                                        </>
                                                    )}
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
                {activeTab === 'aggregators' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Aggregator Management</h2>
                            {canEdit && (
                                <button
                                    onClick={() => openModal('aggregator')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Aggregator</span>
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aggregators.map((aggregator) => (
                                <div key={aggregator.id} className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{aggregator.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            {canEdit && (
                                                <>
                                                    <button
                                                        onClick={() => openModal('aggregator', aggregator)}
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
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Keke Assets Assigned:</span>
                                            <span className="text-sm font-medium">{aggregator.kekesAssigned}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Deployed:</span>
                                            <span className="text-sm font-medium">{aggregator.kekesDeployed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Deployment Rate:</span>
                                            <span className="text-sm font-medium">
                        {((aggregator.kekesDeployed / aggregator.kekesAssigned) * 100).toFixed(1)}%
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Avg Daily Collection:</span>
                                            <span className="text-sm font-medium">₦{aggregator.avgDailyCollection.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Card Payment Ratio:</span>
                                            <span className="text-sm font-medium">{(aggregator.cardPaymentRatio * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{width: `${(aggregator.kekesDeployed / aggregator.kekesAssigned) * 100}%`}}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Deployment Progress</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Transaction Dashboard</h2>

                        {/* Transaction Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Total Collection Today"
                                value={`₦${dashboardMetrics.totalDailyCollection.toLocaleString()}`}
                                icon={DollarSign}
                                trend={8.3}
                                color="emerald"
                            />
                            <MetricCard
                                title="Card Transactions"
                                value={`${(dashboardMetrics.cardPaymentRatio * 100).toFixed(1)}%`}
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
                                <h3 className="text-lg font-semibold mb-4">Daily Collection Trend</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dailyCollectionData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, '']} />
                                        <Line type="monotone" dataKey="collection" stroke="#3B82F6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" />
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
                                        <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                                        <Bar dataKey="revenue" fill="#8B5CF6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Financial Tab */}
                {activeTab === 'financial' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Financial Distribution</h2>

                        {/* Financial Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Collection"
                                value={`₦${dashboardMetrics.totalDailyCollection.toLocaleString()}`}
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
                                <h3 className="text-lg font-semibold">Per-Keke Financial Summary</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Keke ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Daily Revenue
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
                                        const akupayEarnings = keke.dailyRevenue * 0.1; // 10% commission
                                        const netToPicng = keke.dailyRevenue - akupayEarnings - keke.rebatesIssued;

                                        return (
                                            <tr key={keke.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {keke.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₦{keke.dailyRevenue.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {(keke.cardPaymentRatio * 100).toFixed(1)}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₦{keke.rebatesIssued.toLocaleString()}
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
                {activeTab === 'drivers' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
                            {canEdit && (
                                <button
                                    onClick={() => openModal('driver')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                                        const isLicenseExpiring = new Date(driver.licenseExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
                                                    {driver.kekeId || 'Not Assigned'}
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                driver.kycStatus === 'Complete'
                                    ? 'bg-green-100 text-green-800'
                                    : driver.kycStatus === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}>
                              {driver.kycStatus}
                            </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                driver.appUsage === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                              {driver.appUsage}
                            </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        {canEdit && (
                                                            <>
                                                                <button
                                                                    onClick={() => openModal('driver', driver)}
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
            {showModal && modalType === 'keke' && (
                <KekeForm 
                    editingItem={editingItem}
                    aggregators={aggregators}
                    onClose={closeModal}
                    onSave={handleSaveKeke}
                />
            )}
            {showModal && modalType === 'aggregator' && (
                <AggregatorForm 
                    editingItem={editingItem}
                    onClose={closeModal}
                    onSave={handleSaveAggregator}
                />
            )}
            {showModal && modalType === 'driver' && (
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
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                isLoading={isOperationLoading}
            />
            
            {/* Loading Overlay */}
            {isOperationLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#0B4F26' }}></div>
                        <span className="text-gray-700">Processing...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PICNGDashboard;
