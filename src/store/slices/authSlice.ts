/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface User {
    username: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Mock users database
const USERS_DB: Record<string, { password: string; role: UserRole }> = {
    akuadmin: { password: 'AkuAppTest', role: 'SUPER_ADMIN' },
    'picngadmin@admin.com': { password: 'picngadmin123', role: 'ADMIN' },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk action for login
export const login = (username: string, password: string) => async (dispatch: any) => {
    dispatch(loginStart());
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = USERS_DB[username];
        
        if (user && user.password === password) {
            dispatch(loginSuccess({ username, role: user.role }));
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify({ username, role: user.role }));
            return { success: true, user: { username, role: user.role } };
        } else {
            dispatch(loginFailure('Invalid username or password'));
            return { success: false, error: 'Invalid username or password' };
        }
    } catch (error) {
        dispatch(loginFailure('Login failed. Please try again.'));
        return { success: false, error: 'Login failed. Please try again.' };
    }
};

// Thunk action for logout
export const performLogout = () => (dispatch: any) => {
    localStorage.removeItem('user');
    dispatch(logout());
};

// Thunk action to check existing auth
export const checkAuth = () => (dispatch: any) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        dispatch(loginSuccess(user));
    }
};

export default authSlice.reducer;