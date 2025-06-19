import Link from 'next/link';
import Head from 'next/head';

export default function NotFoundPage() {
    return (
        <>
            <Head>
                <title>Page Not Found | 404 Error</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
                <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Decorative header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white">404</h1>
                    </div>

                    {/* Main content */}
                    <div className="p-8 md:p-12 text-center">
                        <div className="mb-8">
                            <div className="relative w-40 h-40 mx-auto">
                                <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                                <svg
                                    className="w-full h-full text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                            Don't worry, let's get you back on track.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/" passHref>
                                <a className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                                    Return Home
                                </a>
                            </Link>

                            <Link href="/contact" passHref>
                                <a className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    Contact Support
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-6 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}