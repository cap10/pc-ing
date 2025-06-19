'use client';

import Image from "next/image";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function Register() {
    const year = new Date().getFullYear();
    const router = useRouter();


    useEffect(() => {
        
    }, [])

    return (
        <section
            className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left side - Decorative */}
                        <div className="hidden lg:block bg-gradient-to-br from-cyan-600 to-cyan-300 p-12 relative">
                            <div className="absolute inset-0 opacity-10"
                                 style={{backgroundImage: "url('/images/pattern.svg')", backgroundSize: 'cover'}}></div>
                            <div className="relative z-10 h-full flex flex-col justify-center text-white">
                                <div className="mb-4 ">
                                    <Image
                                        src="/images/logo.svg"
                                        alt="IBanking Logo"
                                        width={200}
                                        height={80}
                                        className="m-4"
                                    />
                                    <br/>
                                    <br/>
                                    <h2 className="text-3xl font-bold mb-2">Welcome to IBanking</h2>
                                    <p className="text-blue-100">Secure, fast, and reliable banking solutions</p>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center space-x-2 text-blue-100">
                                        <div className="w-10 h-1 bg-blue-300 rounded-full"></div>
                                        <span className="text-white">Customer Self-Registration</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Form */}
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-8">
                                <a href="#" className="inline-block">
                                    <div className="flex items-center justify-center">
                                        <Image
                                            width={280}
                                            height={120}
                                            src="/images/logo.svg"
                                            alt="Minia Logo"
                                            className="m-3"

                                        />

                                    </div>
                                </a>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                                <p className="text-gray-500">Join thousands of satisfied customers banking with us</p>
                            </div>

                            <main className="max-w-md mx-auto">

                                <div className="mb-6">
                                    <Link href='/registration/agent' passHref>
                                        <button
                                            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-300 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                                            type="button"
                                        >
                                            Agent <i className="fa-solid fa-arrow-right ml-2"></i>
                                        </button>
                                    </Link>
                                </div>
                                <div className="mb-6" >
                                    <Link href='/registration/individual' passHref>
                                        <button
                                            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-300 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                                            type="button"
                                        >
                                            Individual <i className="fa-solid fa-arrow-right ml-2"></i>
                                        </button>
                                    </Link>
                                </div>
                                <div className="mb-6">
                                    <Link href='/registration/business' passHref>
                                        <button
                                            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-300 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                                            type="button"
                                        >
                                            Corporate <i className="fa-solid fa-arrow-right ml-2"></i>
                                        </button>
                                    </Link>
                                </div>
                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        Already have an account?{" "}
                                        <Link
                                            href="/login"
                                            className="font-medium text-cyan-400 hover:text-cyan-400 transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </main>

                            <div className="mt-12 text-center">
                                <p className="text-gray-500 text-sm">
                                    © {new Date().getFullYear()} IBanking. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}