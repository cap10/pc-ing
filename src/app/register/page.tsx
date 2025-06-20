'use client';

import Image from "next/image";
import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

type CardId = 'agent' | 'individual' | 'business' | null;

export default function Register() {
    const year = new Date().getFullYear();
    const router = useRouter();

    const [hoveredCard, setHoveredCard] = useState<CardId>(null);

    const registrationOptions = [
        {
            id: 'agent',
            title: 'Agent',
            description: 'Register as a banking agent to serve customers',
            icon: '👥',
            href: '/registration/agent',
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            id: 'individual',
            title: 'Individual',
            description: 'Personal banking account for individuals',
            icon: '👤',
            href: '/registration/individual',
            gradient: 'from-cyan-500 to-teal-600'
        },
        {
            id: 'business',
            title: 'Corporate',
            description: 'Business banking solutions for companies',
            icon: '🏢',
            href: '/registration/business',
            gradient: 'from-cyan-500 to-indigo-600'
        }
    ];


    useEffect(() => {
        
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{animationDelay: '2s'}}></div>
                <div
                    className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-7xl mx-auto">
                    <div
                        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

                            {/* Left side - Decorative */}
                            <div
                                className="relative bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-700 p-8 sm:p-12 lg:p-16">
                                {/* Geometric pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `
                      radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                      radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
                    `,
                                        backgroundSize: '60px 60px'
                                    }}></div>
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                                    <div>
                                        {/* Logo placeholder */}
                                        <div className="mb-8 lg:mb-12">
                                            <div
                                                className="w-48 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <span className="text-white font-bold text-xl">IBanking</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                                Welcome to
                                                <span className="block text-cyan-200">IBanking</span>
                                            </h1>
                                            <p className="text-lg sm:text-xl text-cyan-100 leading-relaxed max-w-md">
                                                Secure, fast, and reliable banking solutions tailored for your needs
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features list */}
                                    <div className="hidden lg:block space-y-4">
                                        <div className="flex items-center space-x-3 text-cyan-100">
                                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                            <span>24/7 Customer Support</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-cyan-100">
                                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                            <span>Advanced Security</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-cyan-100">
                                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                            <span>Mobile Banking</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-1 bg-cyan-300 rounded-full"></div>
                                        <span className="text-cyan-100 font-medium">Customer Self-Registration</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Registration Form */}
                            <div className="p-6 sm:p-8 lg:p-12 xl:p-16">
                                <div className="h-full flex flex-col justify-center max-w-md mx-auto">

                                    {/* Mobile logo */}
                                    <div className="lg:hidden text-center mb-8">
                                        <div
                                            className="inline-block w-32 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">IBanking</span>
                                        </div>
                                    </div>

                                    <div className="text-center mb-8 lg:mb-12">

                                            <Image
                                                src="/images/logo.svg"
                                                alt="IBanking Logo"
                                                width={250}
                                                height={120}
                                                className="m-4"
                                            />
                                            <br/>

                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                            Create Your Account
                                        </h2>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            Join thousands of satisfied customers banking with us
                                        </p>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        {registrationOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                className="group relative"
                                                onMouseEnter={() => setHoveredCard(option.id)}
                                                onMouseLeave={() => setHoveredCard(null)}
                                            >
                                                <Link href={option.href} passHref legacyBehavior>
                                                    <a className={`
        w-full p-4 sm:p-5 rounded-2xl
        bg-gradient-to-r ${option.gradient}
        text-white font-semibold
        shadow-lg hover:shadow-xl
        transform transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        flex items-center justify-between
        group-hover:shadow-2xl
        ${hoveredCard === option.id ? 'ring-4 ring-white/30' : ''}
        block
      `}>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-2xl sm:text-3xl opacity-90 group-hover:scale-110 transition-transform duration-300">
                                                                {option.icon}
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-lg sm:text-xl font-bold">{option.title}</div>
                                                                <div className="text-xs sm:text-sm text-white/80 hidden sm:block">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                                            →
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 lg:mt-12 text-center">
                                        <p className="text-sm text-gray-500">
                                            Already have an account?{" "}
                                            <a
                                                href="/login"
                                                className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors duration-200 hover:underline"
                                            >
                                                Sign in
                                            </a>
                                        </p>
                                    </div>

                                    <div className="mt-8 lg:mt-12 text-center">
                                        <p className="text-xs text-gray-400">
                                            © {new Date().getFullYear()} IBanking. All rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}