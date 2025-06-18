'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionDataByKey } from "../services/auth-service";
import { showToast } from "../utilities/commons";

export default function Navbar() {
    const [userLogged, setUserLogged] = useState('user');
    const [userRole, setUserRole] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function doLogout() {
        try {
            sessionStorage.clear();
            showToast('User Logged Out.', 'info');
            document.location.href = userRole !== 'CUSTOMER' ? '/login' : '/';
        } catch (err) {
            console.log(err);
            showToast('Failed to logout.', 'error');
        }
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        document.body.classList.toggle('sidebar-open');
    };

    useEffect(() => {
        const val = sessionStorage.getItem('display');
        const val2 = sessionStorage.getItem('role');

        getSessionDataByKey(val)?.then(resp => {
            if(resp) setUserLogged(resp);
        });

        getSessionDataByKey(val2)?.then(resp => {
            if(resp) setUserRole(resp);
        });
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>

                {/* Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            width={40}
                            height={40}
                            src="/images/logo-mini.png"
                            alt="Logo"
                            className="block w-auto h-8 md:hidden"
                        />
                        <Image
                            width={150}
                            height={40}
                            src="/images/logo.svg"
                            alt="Logo"
                            className="hidden w-auto h-8 md:block"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <div className="hidden md:block">
                    <h1 id="modName" className="text-lg font-medium text-gray-900">&nbsp;</h1>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        className="hidden p-1 text-gray-400 rounded-full hover:text-gray-500 md:flex items-center"
                    >
                        <span className="sr-only">Help Center</span>
                        <i className="fa-regular fa-circle-question"></i>
                        <span className="ml-2 hidden lg:inline">Help Center</span>
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative ml-3">
                        <div className="flex items-center space-x-2">
                            <button
                                className="flex items-center text-sm rounded-full focus:outline-none"
                                id="user-menu-button"
                            >
                                <Image
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                                    src="/images/avatar.svg"
                                    alt="User avatar"
                                />
                                <span className="ml-2 hidden lg:inline font-medium">{userLogged}</span>
                                <svg className="w-4 h-4 ml-1 hidden lg:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </div>

                        {/* Dropdown menu */}
                        <div className="absolute right-0 z-10 hidden w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Link
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Lock Screen
                            </Link>
                            <Link
                                href="#"
                                onClick={doLogout}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}