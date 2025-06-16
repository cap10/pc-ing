'use client';
import { useEffect, useState, useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';

// Constants for better maintainability
const TIMEOUT = 5 * 60 * 1000; // 5 minutes
const PROMPT_TIMEOUT = 30 * 1000; // 30 seconds

export default function IdleTimerContainer() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(true);
        setRemainingSeconds(Math.floor(PROMPT_TIMEOUT / 1000));
    }, []);

   /* const handleIdle = useCallback(() => {
        setIsModalOpen(false);
        logoutFunction();
    }, [logoutFunction]);*/

    const handleActive = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleStillHere = useCallback(() => {
        setIsModalOpen(false);
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

    if (!isModalOpen) return null;

    return (
        <div
            className="modal"
            style={{
                display: 'block',
                backgroundColor: '#3fab33',
                height: '80px',
                color: 'black',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 16,
                paddingBottom: 4,
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            }}
        >
            <p>Logging you out in {remainingSeconds} seconds</p>
            <button
                className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600"
                onClick={handleStillHere}
            >
                Keep me Signed In
            </button>
        </div>
    );
}