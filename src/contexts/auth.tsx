import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export const publicRoutes = [
    '/login',
    '/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/set-password',
    // Add all public routes here
];

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

export const AuthProvider = ({ children }: Children) => {
    const [user, setUser] = useState<any | null>('');
    const [role, setRole] = useState<any | null>('');
    const [organisationId, setOrganisationId] = useState<any | null>('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isAuthenticated = !!user;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const currentPath = window.location.pathname;

        // Skip auth check for public routes
        if (publicRoutes.includes(currentPath)) {
            return;
        }
        else if (token) {
            authenticate(token);
        } else {
            // Handle the case where the token is not found (e.g., user is not logged in)
            console.log('Token not found, user not logged in.');
            // Optionally redirect the user to the login page or take other actions
            Cookies.remove('access_token');
            localStorage.clear();
            setUser(null);
            setRole(null);
            setOrganisationId(null);
            //console.log('Redirecting');
            router.push( '/');

        }


        if (!token && !organisationId) {
            Cookies.remove('access_token');
            localStorage.clear();
            setUser(null);
            setRole(null);
            setOrganisationId(null);
            setIsLoading(false);
            //console.log('Redirecting');
            router.push( '/');
        }
    }, []);


    const logout = (redirectLocation: string) => {
        Cookies.remove('access_token');
        localStorage.clear();
        setUser(null);
        setRole(null);
        setOrganisationId(null);
        setIsLoading(false);
        //console.log('Redirecting');
        router.push( '/');
    };

    const authenticate = async (token: string) => {
        setIsLoading(true);
        try {

            let userToken = localStorage.getItem('token');
            //console.log("userToken",userToken);
            if (userToken) {
                Cookies.set('access_token', userToken);
            }else{
                // Handle the case where the token is not found (e.g., user is not logged in)
                console.log('Token not found, user not  logged in.');
                // Optionally redirect the user to the login page or take other actions
                Cookies.remove('access_token');
                localStorage.clear();
                setUser(null);
                setRole(null);
                setOrganisationId(null);
                //console.log('Redirecting');
                router.push( '/');
            }

            let organisationIdentifier = localStorage.getItem('organisationId');
            setOrganisationId(organisationIdentifier);

            let userDetails = localStorage.getItem('username');
            //console.log("username",userDetails);
            setUser(userDetails);

            let roleName = localStorage.getItem('role');
            setRole(roleName);

            //Cookies.set('access_token', token);
            //Cookies.set('access_token', userToken);
        } catch (error) {
            /// console.log({ error });
            setUser(null);
            setRole(null);
            //Cookies.remove('access_token');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const Component = children.type;

        // If it doesn't require auth, everything's good.
        if (!Component.requiresAuth) return;

        // If we're already authenticated, everything's good.
        if (isAuthenticated) return;

        // If we don't have a token in the cookies, logout
        const token = Cookies.get('access_token');
        if (!token) {
            return logout(Component.redirectUnauthenticatedTo);
        }

        // If we're not loading give the try to authenticate with the given token.
        if (!isLoading) {
            authenticate(token);
        }
    }, [isLoading, isAuthenticated, children.type.requiresAuth]);

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                organisationId,
                authenticate,
                logout,
                isLoading,
                isAuthenticated: !!user,
                token: Cookies.get('access_token') || '',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



