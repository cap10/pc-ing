import React from 'react';
import { Truck, CheckCircle, DollarSign, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import MetricCard from '../ui/MetricCard';

interface OverviewTabProps {
    dashboardMetrics: any;
    dailyCollectionData: any[];
    paymentMethodData: any[];
    locationPerformanceData: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    dashboardMetrics,
    dailyCollectionData,
    paymentMethodData,
    locationPerformanceData
}) => {
    // Custom label for the center of the pie chart
    const renderCenterLabel = () => {
        const total = paymentMethodData.reduce((sum, entry) => sum + entry.value, 0);
        return (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-600 text-sm font-medium">
                <tspan x="50%" dy="-0.5em">Total</tspan>
                <tspan x="50%" dy="1.2em" className="text-lg font-bold">{total}%</tspan>
            </text>
        );
    };

    return (
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
                    title="Daily Collection"
                    value={`₦${dashboardMetrics.totalDailyCollection.toLocaleString()}`}
                    icon={DollarSign}
                    trend={8.3}
                    color="emerald"
                />
                <MetricCard
                    title="Card Payment Ratio"
                    value={`${(dashboardMetrics.cardPaymentRatio * 100).toFixed(1)}%`}
                    icon={CreditCard}
                    trend={3.7}
                    color="purple"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Collections Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Daily Collections vs Target</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dailyCollectionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, '']} />
                            <Area type="monotone" dataKey="collection" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                            <Area type="monotone" dataKey="target" stroke="#10B981" fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Methods Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                label={({name, value}) => `${name}: ${value}%`}
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            {renderCenterLabel()}
                            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Location Performance */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Location Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={locationPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                            name === 'revenue' ? `₦${value.toLocaleString()}` : value,
                            name === 'revenue' ? 'Revenue' : 'Keke Count'
                        ]} />
                        <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OverviewTab;