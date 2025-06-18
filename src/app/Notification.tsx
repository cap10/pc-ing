'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type ToastProps = {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose?: () => void;
    duration?: number;
};

export const ToastNotification = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const bgColor = {
        success: 'bg-green-100 border-green-400',
        error: 'bg-red-100 border-red-400',
        info: 'bg-blue-100 border-blue-400',
    }[type];

    const textColor = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
    }[type];

    const icon = {
        success: <CheckCircleIcon className={`h-6 w-6 ${textColor}`} />,
        error: <ExclamationCircleIcon className={`h-6 w-6 ${textColor}`} />,
        info: <ExclamationCircleIcon className={`h-6 w-6 ${textColor}`} />,
    }[type];

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`flex items-center p-4 rounded-lg border ${bgColor} shadow-lg max-w-xs md:max-w-md transition-all duration-300 ease-in-out`}
            >
                <div className="mr-3">{icon}</div>
                <div className={`flex-1 text-sm font-medium ${textColor}`}>{message}</div>
                <button
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};