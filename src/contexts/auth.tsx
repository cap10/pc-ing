import React, {ReactNode, useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {createContext} from "node:vm";

// Define public routes that don't require authentication
export const publicRoutes = [
    '/login',
    '/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/set-password',
    '/', // Assuming your home page is also public
];

interface AuthContextType {
    user: any;
    role: any;
    organisationId: any;
    authenticate: (token: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
}

const AuthContext = React.createContext(
    {} as {
        user: any;
        role: any;
        organisationId: any;
        authenticate: (newToken: string) => Promise<void>;
        logout: (redirectLocation: string) => void;
        isLoading: boolean;
        isAuthenticated: boolean;
        token: string;
    }
);
type Children = {
    children: any;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [role, setRole] = useState<any | null>(null);
    const [organisationId, setOrganisationId] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as loading, will become false after initial check
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // isAuthenticated is derived from user and token presence
    const isAuthenticated = !!user && !!token;

    // Centralized function to clear all auth data and redirect to login
    const clearAuthDataAndRedirect = () => {
        Cookies.remove('access_token'); // Clear the cookie
        localStorage.clear(); // Clear all localStorage items
        setUser(null);
        setRole(null);
        setOrganisationId(null);
        setToken(null);
        setIsLoading(false); // Authentication process is now complete (as logged out)
        router.push('/login'); // Always redirect to the login page
    };

    // Logout function exposed via context
    const logout = () => {
        clearAuthDataAndRedirect();
    };

    // Authentication function
    /*const authenticate = async (authToken: string) => {
        setIsLoading(true); // Set loading true at the start of authentication
        try {
            if (!authToken) {
                console.warn('Authenticate called with no token. Treating as logout.');
                clearAuthDataAndRedirect();
                return;
            }

            // Set token in Cookies for persistence and state for immediate use
            // Consider adding an 'expires' option for Cookies.set for persistent login
            Cookies.set('access_token', authToken, { expires: 7 }); // Example: token expires in 7 days
            setToken(authToken);

            // Retrieve user details from localStorage (or make an API call if needed)
            const organisationIdentifier = localStorage.getItem('organisationId');
            const userDetails = localStorage.getItem('username');
            const roleName = localStorage.getItem('role');

            // Update state with user details
            setUser(userDetails);
            setRole(roleName);
            setOrganisationId(organisationIdentifier);

        } catch (error) {
            console.error('Authentication failed:', error);
            // On any error during authentication, clear data and redirect
            clearAuthDataAndRedirect();
        } finally {
            setIsLoading(false); // Always set loading to false when authentication attempt finishes
        }
    };*/

    const authenticate =  () => {
        //setIsLoading(true); // Set loading true at the start of authentication
        try {

            // Retrieve user details from localStorage (or make an API call if needed)
            const userToken = localStorage.getItem('token');
            const organisationIdentifier = localStorage.getItem('organisationId');
            const userDetails = localStorage.getItem('username');
            const roleName = localStorage.getItem('role');

            // Update state with user details
            setToken(userToken);
            setUser(userDetails);
            setRole(roleName);
            setOrganisationId(organisationIdentifier);

        } catch (error) {
            console.error('Authentication failed:', error);
            // On any error during authentication, clear data and redirect
            clearAuthDataAndRedirect();
        } finally {
            setIsLoading(false); // Always set loading to false when authentication attempt finishes
        }
    };

    // Effect to run once on mount to check initial authentication status
    useEffect(() => {
        const initialToken = Cookies.get('access_token'); // Read from cookies for initial check
        const currentPath = router.pathname;

        // If it's a public route, no authentication check is needed
        if (publicRoutes.includes(currentPath)) {
            setIsLoading(false); // Ensure loading state is false for public routes
            return;
        }

        // If a token is found, attempt to authenticate
        if (initialToken) {
            authenticate();
        } else {
            // No token found and it's not a public route, so redirect to login
            clearAuthDataAndRedirect();
        }
    }, []); // Empty dependency array means this effect runs only once on component mount

    // Effect to guard protected routes
    useEffect(() => {
        // Only run this logic if the initial loading check is complete
        if (!isLoading) {
            const currentPath = router.pathname;

            // If the current route is public, no guarding is needed
            if (publicRoutes.includes(currentPath)) {
                return;
            }

            // If it's a protected route and the user is NOT authenticated, redirect to login
            if (!isAuthenticated) {
                router.push('/login');
            }
        }
    }, [isLoading, isAuthenticated, router.pathname]); // Re-run when these dependencies change

    return (
        <></>
       /* <AuthContext.Provider
            value={{
                user,
                role,
                organisationId,
                authenticate,
                logout,
                isLoading,
                isAuthenticated,
                token,
            }}
        >
            {children}
        </AuthContext.Provider>*/
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};