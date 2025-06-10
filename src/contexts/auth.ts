// lib/auth.ts
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Axios from "axios";

export const publicRoutes = [
    '/login',
    '/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/set-password',
    '/',
];

export const useAuth = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);

    // Initialize auth state from sessionStorage
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const customerId = sessionStorage.getItem('customerId');
        if (token) setToken(token);
        if (customerId) setCustomerId(customerId);
    }, []);

    const isAuthenticated = !!token && !!customerId;

    const login = async (token: string, customerId: string) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('customerId', customerId);
        setToken(token);
        setCustomerId(customerId);

        // Also set the token in axios default headers
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        sessionStorage.clear();
        localStorage.clear();
        Cookies.remove('access_token');
        setToken(null);
        setCustomerId(null);
        delete Axios.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    // Route protection
    useEffect(() => {
        if (publicRoutes.includes(router.pathname)) return;

        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router.pathname]);

    return { token, customerId, isAuthenticated, login, logout };
};