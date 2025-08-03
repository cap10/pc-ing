import React from "react";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color?: string;
  breakdown?: {
    label: string;
    value: string | number;
    trend?: number;
  }[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  breakdown,
}) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between h-full w-full">
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              {title}
            </p>
            <div
              className={`p-3 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-200`}
            >
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              {value && (
                <p className={`text-2xl font-bold text-black`}>{value}</p>
              )}
              {trend && !breakdown && (
                        <div className="flex items-center">
                        <div
                          className={`inline-flex items-center px-1.5 rounded-full text-[9px] font-medium ${
                            trend > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <TrendingUp
                            className={`w-3 h-3 mr-1 ${
                              trend < 0 ? "rotate-180" : ""
                            }`}
                          />
                          {trend > 0 ? "+" : ""}
                          {trend}%
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          vs last week
                        </span>
                      </div>
              )}
            </div>
            {breakdown && (
              <div className="space-y-2">
                {breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600">{item.label}</span>
                      {item.trend && (
                        <div className="flex items-center">
                          <div
                            className={`inline-flex items-center px-1.5 rounded-full text-[9px] font-medium ${
                              item.trend > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <TrendingUp
                              className={`w-3 h-3 mr-1 ${
                                item.trend < 0 ? "rotate-180" : ""
                              }`}
                            />
                            {item.trend > 0 ? "+" : ""}
                            {item.trend}%
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            vs last week
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 text-right">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
