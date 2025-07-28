'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import LoginScreen from '../../components/auth/LoginScreen';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading } = useAppSelector((state) => state.auth);

    const handleLogin = async (username: string, password: string) => {
        const result = await dispatch(login(username, password)) as any;
        if (result.success) {
            toast.success('Login successful');
            router.push('/');
        } else {
            toast.error('Username/password is invalid', {
                description: 'Please check your credentials and try again.'
            });
        }
    };

    return (
        <LoginScreen 
            onLogin={handleLogin}
            isLoading={isLoading}
        />
    );
};

export default LoginPage;