"use client"

import Axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export const publicRoutes = [
    '/login',
    '/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/set-password',
    '/', // Assuming your home page is also public
];


export const AuthGuardService  = () =>{
    const router = useRouter();
    const [username, setUserName] = useState<any>(null);
    const [token, setToken] = useState<any>(null);
    const [customerId,  setCustomerId]  = useState<any>(null)

    // isAuthenticated is derived from user and token presence
    const isAuthenticated = !!customerId && !!token;

    const authenticate  = () =>{

        try {

            // Retrieve user details from localStorage (or make an API call if needed)
            const userToken = sessionStorage.getItem('token');
            const customerIdentifier = sessionStorage.getItem('customerId');
            //const userDetails = sessionStorage.getItem('username');

            // Update state with user details
            setToken(userToken);
            setCustomerId(customerIdentifier);

        } catch (error) {
            console.error('Authentication failed:', error);
            // On any error during authentication, clear data and redirect
        }
    }

    const logout = () =>{
        sessionStorage.clear();
        localStorage.clear();
        Cookies.remove('access_token');
        setCustomerId(null);
        setToken(null);
        router.push('/login');
        }

        //check if user is authenticated
    useEffect(() => {
        // Only run this logic if the initial loading check is complete

            const currentPath = router.pathname;

            // If the current route is public, no guarding is needed
            if (publicRoutes.includes(currentPath)) {
                return;
            }

            // If it's a protected route and the user is NOT authenticated, redirect to login
            if (!isAuthenticated) {
                router.push('/login');
            }

    }, [ isAuthenticated, router.pathname]); // Re-run when these dependencies change



}

return(
    <></>
)