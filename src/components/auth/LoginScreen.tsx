'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (username: string, password: string) => void;
    isLoading?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            onLogin(username, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div 
                        className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: '#0B4F26' }}
                    >
                        <div className="text-white font-bold text-2xl">P</div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        PICNG Dashboard
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none relative block w-full pl-5 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="appearance-none relative block w-full pl-5 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Login Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !username.trim() || !password.trim()}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ 
                                backgroundColor: '#0B4F26'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && username.trim() && password.trim()) {
                                    (e.target as HTMLElement).style.backgroundColor = '#155c35';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading && username.trim() && password.trim()) {
                                    (e.target as HTMLElement).style.backgroundColor = '#0B4F26';
                                }
                            }}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Powered by Akupay • {new Date().getFullYear()}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;