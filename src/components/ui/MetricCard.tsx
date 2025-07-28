import React from 'react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = "blue" 
}) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                {trend && (
                    <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {trend > 0 ? '+' : ''}{trend}%
                    </p>
                )}
            </div>
            <Icon className={`w-12 h-12 text-${color}-600`} />
        </div>
    </div>
);

export default MetricCard;