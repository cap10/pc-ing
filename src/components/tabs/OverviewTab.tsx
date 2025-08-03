/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Truck, CreditCard, Currency } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import MetricCard from "../ui/MetricCard";
import { customTooltipStyle } from "../../utils/chartConfig";

interface OverviewTabProps {
  dashboardMetrics: any;
  weeklyCollectionData: any[];
  paymentMethodData: any[];
  cooperativePerformanceData: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  dashboardMetrics,
  weeklyCollectionData,
//   paymentMethodData,
  cooperativePerformanceData,
}) => {
  // Custom label for the center of the pie chart
//   const renderCenterLabel = () => {
//     const total = paymentMethodData.reduce(
//       (sum, entry) => sum + entry.value,
//       0
//     );
//     return (
//       <text
//         x="50%"
//         y="50%"
//         textAnchor="middle"
//         dominantBaseline="middle"
//         className="fill-gray-600 text-sm font-medium"
//       >
//         <tspan x="50%" dy="-0.5em">
//           Total
//         </tspan>
//         <tspan x="50%" dy="1.2em" className="text-lg font-bold">
//           {total}%
//         </tspan>
//       </text>
//     );
//   };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Assets"
          icon={Truck}
          color="black"
          breakdown={[
            {
              label: "Total Assigned",
              value: dashboardMetrics.totalKekesAssigned,
            },
            { label: "Picked Up", value: dashboardMetrics.kekesPickedUp },
            {
              label: "Actively Deployed",
              value: dashboardMetrics.kekesActivelyDeployed,
            },
            {
                label: 'Non-deployed',
                value: dashboardMetrics.kekesPickedUp - dashboardMetrics.kekesActivelyDeployed
            }
          ]}
        />
        <MetricCard
          title="Project Financials"
          icon={Currency}
          color="black"
          breakdown={[
            {
              label: "Total revenue",
              value: `₦${dashboardMetrics.totalRevenue.toLocaleString()}`,
            },
            {
              label: "Weekly revenue",
              value: `₦${dashboardMetrics.totalWeeklyCollection.toLocaleString()}`,
              trend: -100
            },
          ]}
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

      {/* Charts Row */}
      <div className="grid gap-6">
        {/* Monthly Collections Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Monthly Collections vs Target
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Target: ₦52,900 × {dashboardMetrics.kekesActivelyDeployed} deployed kekes
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
            <AreaChart
              data={weeklyCollectionData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="collectionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
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
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `₦${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `₦${(value / 1000).toFixed(0)}K`;
                  } else {
                    return `₦${value}`;
                  }
                }}
              />
              <Tooltip
                {...customTooltipStyle}
                formatter={(value, name) => [
                  `₦${value.toLocaleString()}`,
                  name === "collection" ? "Collections" : "Target",
                ]}
              />
              <Area
                type="monotone"
                dataKey="collection"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#collectionGradient)"
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="8 4"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Pie Chart */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            Payment Methods Distribution
          </h3>
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
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {renderCenterLabel()}
              <Tooltip
                {...customTooltipStyle}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Cooperative Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Cooperative Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cooperativePerformanceData} barGap={4}>
            <CartesianGrid
              strokeDasharray="0"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="cooperative"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              domain={[0, "dataMax + 10000"]}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `₦${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `₦${(value / 1000).toFixed(0)}K`;
                } else {
                  return `₦${value}`;
                }
              }}
              label={{
                value: "",
                angle: -90,
                position: "insideLeft",
              }}
              dx={-20}
            />
            <Tooltip
              {...customTooltipStyle}
              formatter={(value, name) => [
                name === "revenue" ? `₦${value.toLocaleString()}` : value,
                name === "revenue" ? "Revenue" : 
                name === "kekeCount" ? "Deployed Kekes" : "Assigned Kekes",
              ]}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {cooperativePerformanceData.map((_, index) => {
                const colors = [
                  "#3b82f6",
                  "#ef4444",
                  "#10b981",
                  "#f59e0b",
                  "#8b5cf6",
                  "#06b6d4",
                ];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                );
              })}
            </Bar>
            <Bar dataKey="kekeCount" radius={[8, 8, 0, 0]}>
              {cooperativePerformanceData.map((_, index) => {
                const colors = [
                  "#1e40af",
                  "#dc2626",
                  "#059669",
                  "#d97706",
                  "#7c3aed",
                  "#0891b2",
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
  );
};

export default OverviewTab;
