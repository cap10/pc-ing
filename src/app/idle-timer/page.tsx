'use client';
import { useEffect, useState, useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {ClockIcon} from "@heroicons/react/16/solid";

// Constants for better maintainability
const TIMEOUT = 3 * 60 * 1000; // 5 minutes
const PROMPT_TIMEOUT = 30 * 1000; // 30 seconds

export default function IdleTimerContainer() {
    const router = useRouter();

    const [idleOpen, setIdleOpen] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [isActive, setIsActive] = useState(true);
    //const [isModalOpen, setIdleOpen] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    // Memoized logout function to prevent unnecessary recreations
    /*const logoutFunction = useCallback(() => {
        Cookies.remove('access_token');
        localStorage.clear();
        logout();
        router.push('/login');
    }, [logout, router]);*/

    // Event handlers
    const handlePrompt = useCallback(() => {
        setIdleOpen(true);
        setRemainingSeconds(Math.floor(PROMPT_TIMEOUT / 1000));
    }, []);

   /* const handleIdle = useCallback(() => {
        setIdleOpen(false);
        logoutFunction();
    }, [logoutFunction]);*/

    const handleActive = useCallback(() => {
        setIdleOpen(false);
    }, []);

    const handleStillHere = useCallback(() => {
        setIdleOpen(false);
        reset();
    }, []);

    // Initialize idle timer
    const { getRemainingTime, isPrompted, reset } = useIdleTimer({
        timeout: TIMEOUT,
        promptTimeout: PROMPT_TIMEOUT,
        onPrompt: handlePrompt,
        //onIdle: handleIdle,
        onActive: handleActive,
        crossTab: true,
        debounce: 500 // Add debounce to prevent rapid firing
    });

    // Update remaining seconds
    useEffect(() => {
        if (!isPrompted()) return;

        const interval = setInterval(() => {
            const seconds = Math.ceil(getRemainingTime() / 1000);
            setRemainingSeconds(seconds > 0 ? seconds : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [getRemainingTime, isPrompted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Any additional cleanup if needed
        };
    }, []);

    if (!idleOpen) return null;

    // Demo button to trigger modal
    const triggerIdle = () => {
        setIdleOpen(true);
        setIsActive(false);
        setCountdown(30);
    };

    const handleContinue = () => {
        setIdleOpen(false);
        setCountdown(30);
        setIsActive(true);
    };

    const handleLogout = () => {
        setIdleOpen(false);
        alert('You have been logged out');
        setCountdown(30);
    };

    return (
        <>
            {/* Idle Timeout Modal */}
            {idleOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full max-w-md border border-orange-200/50">
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-6 pt-6 pb-4">
                                <div className="text-center">
                                    {/* Warning Icon with Animation */}
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 mb-4 animate-pulse shadow-lg">
                                        <ExclamationTriangleIcon className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-orange-800 mb-2">
                                        Session Timeout Warning
                                    </h3>

                                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full mb-4"></div>

                                    <div className="space-y-4 mb-6">
                                        <p className="text-gray-700">
                                            You have been idle for a while. Your session will expire soon for security reasons.
                                        </p>

                                        {/* Countdown Display */}
                                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
                                            <div className="flex items-center justify-center space-x-2">
                                                <ClockIcon className="h-5 w-5 text-orange-600" />
                                                <span className="text-lg font-bold text-orange-700">
                          {countdown} seconds
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                until automatic logout
                                            </p>
                                        </div>

                                        <p className="text-sm text-orange-600">
                                            Click "Continue" to extend your session or "Logout" to end it now.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleContinue}
                                            className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <ClockIcon className="w-4 h-4 mr-2" />
                                            Continue Session
                                        </button>

                                        <button

                                            className="w-full inline-flex justify-center items-center rounded-lg bg-gray-500 hover:bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                                        >
                                            Logout Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}</>
    );
}