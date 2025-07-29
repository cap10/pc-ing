import React from 'react';

interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    formatter?: (value: any, name: string) => [string, string];
    labelFormatter?: (label: string) => string;
}

const ChartTooltip: React.FC<TooltipProps> = ({ 
    active, 
    payload, 
    label,
    formatter,
    labelFormatter
}) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="bg-gray-900 text-white p-3 rounded-xl shadow-2xl border border-gray-800">
            {label && (
                <p className="font-bold text-gray-100 mb-2">
                    {labelFormatter ? labelFormatter(label) : label}
                </p>
            )}
            <div className="space-y-1">
                {payload.map((entry, index) => {
                    const [formattedValue, formattedName] = formatter 
                        ? formatter(entry.value, entry.name)
                        : [entry.value, entry.name];
                    
                    return (
                        <div key={index} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-gray-300">
                                    {formattedName}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {formattedValue}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChartTooltip;