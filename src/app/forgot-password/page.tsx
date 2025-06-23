'use client';

import Image from "next/image";
import {useState} from "react";
import {useRouter, useSearchParams} from 'next/navigation'
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginAxiosClient} from "@/endpoints/loginApi";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {XCircleIcon} from "@heroicons/react/16/solid";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {CheckCircleIcon} from "@heroicons/react/24/outline";

const validationSchema = Yup.object({
    password: Yup.string()
        .required('Password required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number'),
    confirmPassword: Yup.string()
        .required('Please confirm password')
        .oneOf([Yup.ref('password')] as const, 'Passwords do not match'),
});

export default function ForgotPassword() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const year = new Date().getFullYear();
    const [showPassword, setShowPassword] = useState(false);    
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);

    const SetPasswordForm = useFormik({
        async onSubmit<Values>(values: any, { resetForm, setErrors }: any) {

            setIsSubmitting(true);
            const  payload = {
                token:token,
                password:values.password,
                confirmPassword:values.confirmPassword,
            }
            
            try {
                
                const { data } = await loginAxiosClient.post('v1/users/reset-password', payload);
                if (data != null ) {
                    setIsSubmitting(false);
                    await router.push('/login');
                    setSuccessOpen(true);
                }
            } catch (err:any) {
                    if (err.response.status === 400 || err.response.status === 401) {
                        setIsSubmitting(false);
                        setFailureOpen(true);
                    } else {
                        setIsSubmitting(false);
                        setFailureOpen(true);
                    }
            }
        },

        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
    });


    return (

        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">

                {/* Success Modal */}
                <Dialog open={successOpen} onClose={setSuccessOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95 border border-green-200/50"
                            >
                                <div
                                    className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="text-center">
                                        {/* Success Icon with Animation */}
                                        <div
                                            className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 animate-bounce shadow-lg">
                                            <CheckCircleIcon
                                                className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse"/>
                                        </div>

                                        <DialogTitle as="h3"
                                                     className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                                            Password Reset Successful!
                                        </DialogTitle>

                                        <div
                                            className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>

                                        <div className="space-y-3 mb-6">
                                            <p className="text-sm sm:text-base text-green-700 font-medium">
                                                Your password reset has completed successfully.
                                            </p>

                                            <div
                                                className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Password:</span>
                                                        <span className="font-semibold text-green-700">Updated</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="font-semibold text-green-700">Completed</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-green-600">
                                                Please login to access your account.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSuccessOpen(false)}
                                            className="w-full inline-flex justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 sm:py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-2"/>
                                            Great, Thanks!
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>

                {/* Failure Modal */}
                <Dialog open={failureOpen} onClose={setFailureOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95 border border-red-200/50"
                            >
                                <div className="bg-gradient-to-br from-red-50 to-rose-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="text-center">
                                        {/* Failure Icon with Animation */}
                                        <div
                                            className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mb-4 animate-pulse shadow-lg">
                                            <XCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white"/>
                                        </div>

                                        <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-red-800 mb-2">
                                            Password Reset Failed
                                        </DialogTitle>

                                        <div
                                            className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>

                                        <div className="space-y-3 mb-6">
                                            <p className="text-sm sm:text-base text-red-700 font-medium">
                                                We couldn't complete your password reset process please contact Admin.
                                            </p>

                                            <div
                                                className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Error Code:</span>
                                                        <span className="font-semibold text-red-700">#ERR_001</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Reason:</span>
                                                        <span className="font-semibold text-red-700">Invalid Request</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="font-semibold text-red-700">Failed</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                <div className="flex items-start">
                                                    <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0"
                                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                                    </svg>
                                                    <p className="text-xs sm:text-sm text-amber-700">
                                                        Please contact admin to reset your password and try again.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setFailureOpen(false)}
                                                className="flex-1 inline-flex justify-center rounded-lg bg-white px-4 py-2 sm:py-3 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-300 ring-inset hover:bg-gray-50 transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFailureOpen(false);

                                                }}
                                                className="flex-1 inline-flex justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 sm:py-3 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>


                <div className="min-h-screen flex items-center justify-center">

                    <div className="w-full max-w-md">
                        <div className="flex items-center justify-center">
                            <Image
                                width={280}
                                height={95}
                                src="/images/logo.svg"
                                alt="Minia Logo"
                                className="mb-4"
                            />
                        </div>
                        {/* Card Container */}
                        <div
                            className="bg-white rounded-2xl shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">

                            {/* Header Section */}
                            <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-cyan-500 to-indigo-400">
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                    </div>
                                    <h5 className="text-2xl font-bold text-white mb-2">Set New Password</h5>
                                    <p className="text-gray-300">Create your own desired password.</p>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="px-8 py-8">

                                <form onSubmit={SetPasswordForm.handleSubmit} className="space-y-6">

                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm sm:text-base font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                         stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                    Password
                                                </div>
                                            </label>
                                        </div>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                            </div>
                                            <input
                                                name="password"
                                                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                    SetPasswordForm.errors.password && SetPasswordForm.touched.password
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                required
                                                onChange={SetPasswordForm.handleChange}
                                                onBlur={SetPasswordForm.handleBlur}
                                                value={SetPasswordForm.values.password}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash
                                                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                ) : (
                                                    <FaEye
                                                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Password must be at least 12 characters with uppercase, lowercase letters,
                                            number
                                            and a special character
                                        </p>

                                        {SetPasswordForm.errors.password && SetPasswordForm.touched.password && (
                                            <div className="flex items-center mt-2 text-red-600 text-sm">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                {SetPasswordForm.errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm sm:text-base font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                         stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                    Confirm Password
                                                </div>
                                            </label>

                                        </div>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                            </div>
                                            <input
                                                name="confirmPassword"
                                                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                    SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                required
                                                onChange={SetPasswordForm.handleChange}
                                                onBlur={SetPasswordForm.handleBlur}
                                                value={SetPasswordForm.values.confirmPassword}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <FaEyeSlash
                                                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                ) : (
                                                    <FaEye
                                                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                )}
                                            </button>
                                        </div>
                                        {SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword && (
                                            <div className="flex items-center mt-2 text-red-600 text-sm">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                {SetPasswordForm.errors.confirmPassword}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                            disabled={SetPasswordForm.isSubmitting}
                                            type="submit"
                                        >
                                            {SetPasswordForm.isSubmitting ? (
                                                <span className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                     strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor"
                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Processing...
                         </span>
                                            ) : (
                                                "Set Password"
                                            )}
                                        </button>
                                    </div>
                                </form>


                                {/* Additional Info */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>Secure verification powered by iBanking</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8">
                            <p className="text-gray-500 text-sm">
                                © {year} iBanking. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Loading Overlay */}
                {isSubmitting && (
                    <div
                        className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div
                            className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-white/30 relative overflow-hidden">

                            {/* Animated background gradient */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 animate-pulse"></div>

                            {/* Enhanced spinner with multiple rings */}
                            <div className="relative mb-6">
                                <div
                                    className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-transparent border-t-cyan-500 border-r-cyan-400"></div>
                                <div
                                    className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-300"
                                    style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                                <div
                                    className="absolute inset-4 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
                            </div>

                            {/* Enhanced text with subtle animations */}
                            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 text-center">
                                Setting your Password
                                <span className="inline-block animate-pulse">...</span>
                            </h3>

                            <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4">
                                Please wait we securely set your password
                            </p>

                            {/* Progress indicator */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse"
                                    style={{width: '70%'}}></div>
                            </div>

                            {/* Status text */}
                            <p className="text-xs text-gray-500 text-center animate-pulse">
                                Updating your password...
                            </p>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
                                 style={{animationDelay: '0.5s'}}></div>
                        </div>
                    </div>
                )}
            </div>
        </section>


        /* <section
             className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
             {/!* Background decorative elements *!/}
             <div className="absolute inset-0 overflow-hidden">
                 <div
                     className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                 <div
                     className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                 <div
                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"></div>
             </div>

             {/!* Success Modal *!/}
             <Dialog open={successOpen} onClose={setSuccessOpen} className="relative z-10">
                 <DialogBackdrop
                     transition
                     className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                 />

                 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                         <DialogPanel
                             transition
                             className="relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95 border border-green-200/50"
                         >
                             <div
                                 className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                 <div className="text-center">
                                     {/!* Success Icon with Animation *!/}
                                     <div
                                         className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 animate-bounce shadow-lg">
                                         <CheckCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse"/>
                                     </div>

                                     <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                                         Password Reset Successful!
                                     </DialogTitle>

                                     <div
                                         className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>

                                     <div className="space-y-3 mb-6">
                                         <p className="text-sm sm:text-base text-green-700 font-medium">
                                             Your password update completed successfully.
                                         </p>

                                         <div
                                             className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                                             <div className="space-y-2 text-sm">
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-600">Status:</span>
                                                     <span className="font-semibold text-green-700">Completed</span>
                                                 </div>
                                                 <div className="flex justify-between">
                                                     <span
                                                         className="text-gray-600">Please login to access your account:</span>
                                                 </div>
                                             </div>
                                         </div>

                                         <p className="text-xs sm:text-sm text-green-600">
                                             Enjoy Banking with us.
                                         </p>
                                     </div>

                                     <button
                                         onClick={() => setSuccessOpen(false)}
                                         className="w-full inline-flex justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 sm:py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                     >
                                         <CheckCircleIcon className="w-4 h-4 mr-2"/>
                                         Great, Thanks!
                                     </button>
                                 </div>
                             </div>
                         </DialogPanel>
                     </div>
                 </div>
             </Dialog>


             {/!* Failure Modal *!/}
             <Dialog open={failureOpen} onClose={setFailureOpen} className="relative z-10">
                 <DialogBackdrop
                     transition
                     className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                 />

                 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                         <DialogPanel
                             transition
                             className="relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md data-closed:sm:translate-y-0 data-closed:sm:scale-95 border border-red-200/50"
                         >
                             <div className="bg-gradient-to-br from-red-50 to-rose-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                 <div className="text-center">
                                     {/!* Failure Icon with Animation *!/}
                                     <div
                                         className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mb-4 animate-pulse shadow-lg">
                                         <XCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white"/>
                                     </div>

                                     <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-red-800 mb-2">
                                         Password Set Failed
                                     </DialogTitle>

                                     <div
                                         className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>

                                     <div className="space-y-3 mb-6">
                                         <p className="text-sm sm:text-base text-red-700 font-medium">
                                             Password set failed!.
                                         </p>

                                         <div
                                             className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
                                             <div className="space-y-2 text-sm">
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-600">Error Code:</span>
                                                     <span className="font-semibold text-red-700">#ERR_401</span>
                                                 </div>
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-600">Reason:</span>
                                                     <span
                                                         className="font-semibold text-red-700">Operation Failed</span>
                                                 </div>
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-600">Status:</span>
                                                     <span className="font-semibold text-red-700">Failed</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="flex space-x-3">
                                         <button
                                             onClick={() => setFailureOpen(false)}
                                             className="flex-1 inline-flex justify-center rounded-lg bg-white px-4 py-2 sm:py-3 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-300 ring-inset hover:bg-gray-50 transition-all duration-300"
                                         >
                                             Cancel
                                         </button>
                                         <button
                                             onClick={() => {
                                                 setFailureOpen(false);
                                             }}
                                             className="flex-1 inline-flex justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 sm:py-3 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                                         >
                                             Try Again
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </DialogPanel>
                     </div>
                 </div>
             </Dialog>

             <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="flex flex-col min-h-screen">
                     {/!* Main Content *!/}
                     <div className="flex-grow flex items-center justify-center py-8 sm:py-12">
                         <div className="w-full max-w-md lg:max-w-lg">
                             {/!* Logo Section *!/}
                             <div className="mx-auto mb-8 sm:mb-12 text-center">
                                 <div className="flex items-center justify-center space-x-3">
                                     <div className="relative">
                                         <Image
                                             width={190}
                                             height={90}
                                             src="/images/logo.svg"
                                             alt="Company Logo"
                                             className="m-1"
                                         />
                                     </div>
                                 </div>
                             </div>

                             {/!* Login Card *!/}
                             <div
                                 className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
                                 <div className="text-center mb-6 sm:mb-8">
                                     <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Administration</h2>
                                     <p className="mt-2 text-gray-500 text-sm sm:text-base">Sign in to continue</p>
                                     <div
                                         className="w-80 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                                 </div>

                                 <form onSubmit={SetPasswordForm.handleSubmit} className="space-y-6">


                                     {/!* Password Field *!/}
                                     <div className="relative">
                                         <div className="flex justify-between items-center mb-2">
                                             <label className="block text-sm sm:text-base font-medium text-gray-700">
                                                 <div className="flex items-center">
                                                     <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                          stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round"
                                                               strokeWidth={2}
                                                               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                     </svg>
                                                     Password
                                                 </div>
                                             </label>
                                         </div>
                                         <div className="relative group">
                                             <div
                                                 className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                 <svg
                                                     className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                 </svg>
                                             </div>
                                             <input
                                                 name="password"
                                                 className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                     SetPasswordForm.errors.password && SetPasswordForm.touched.password
                                                         ? "border-red-500"
                                                         : "border-gray-300"
                                                 }`}
                                                 type={showPassword ? "text" : "password"}
                                                 placeholder="Enter your password"
                                                 required
                                                 onChange={SetPasswordForm.handleChange}
                                                 onBlur={SetPasswordForm.handleBlur}
                                                 value={SetPasswordForm.values.password}
                                             />
                                             <button
                                                 type="button"
                                                 className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                                                 onClick={() => setShowPassword(!showPassword)}
                                             >
                                                 {showPassword ? (
                                                     <FaEyeSlash
                                                         className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                 ) : (
                                                     <FaEye
                                                         className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                 )}
                                             </button>
                                         </div>
                                         <p className="text-xs text-gray-500 mt-2">
                                             Password must be at least 12 characters with uppercase, lowercase letters,
                                             number
                                             and a special character
                                         </p>
                                         {SetPasswordForm.errors.password && SetPasswordForm.touched.password && (
                                             <p className="mt-2 text-sm text-red-600">
                                                 {SetPasswordForm.errors.password}
                                             </p>
                                         )}
                                     </div>

                                     <div className="relative">
                                         <div className="flex justify-between items-center mb-2">
                                             <label className="block text-sm sm:text-base font-medium text-gray-700">
                                                 <div className="flex items-center">
                                                     <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                          stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round"
                                                               strokeWidth={2}
                                                               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                     </svg>
                                                     Confirm Password
                                                 </div>
                                             </label>

                                         </div>
                                         <div className="relative group">
                                             <div
                                                 className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                 <svg
                                                     className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                 </svg>
                                             </div>
                                             <input
                                                 name="confirmPassword"
                                                 className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                     SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword
                                                         ? "border-red-500"
                                                         : "border-gray-300"
                                                 }`}
                                                 type={showConfirmPassword ? "text" : "password"}
                                                 placeholder="Confirm Password"
                                                 required
                                                 onChange={SetPasswordForm.handleChange}
                                                 onBlur={SetPasswordForm.handleBlur}
                                                 value={SetPasswordForm.values.confirmPassword}
                                             />
                                             <button
                                                 type="button"
                                                 className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                             >
                                                 {showConfirmPassword ? (
                                                     <FaEyeSlash
                                                         className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                 ) : (
                                                     <FaEye
                                                         className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                                 )}
                                             </button>
                                         </div>
                                         {SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword && (
                                             <p className="mt-2 text-sm text-red-600">
                                                 {SetPasswordForm.errors.confirmPassword}
                                             </p>
                                         )}
                                     </div>

                                     {/!* Submit Button *!/}
                                     <div>
                                         <button
                                             className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                             disabled={SetPasswordForm.isSubmitting}
                                             type="submit"
                                         >
                                             {SetPasswordForm.isSubmitting ? (
                                                 <span className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                     strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor"
                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Processing...
                         </span>
                                             ) : (
                                                 "Set Password"
                                             )}
                                         </button>
                                     </div>
                                 </form>

                                 {/!* Sign Up Link *!/}
                                 <div className="mt-6 sm:mt-8 text-center">
                                     <p className="text-sm text-gray-500">
                                         Remembered Password?{" "}
                                         <Link
                                             href="/login"
                                             className="font-medium text-cyan-400 hover:text-cyan-400 transition-colors"
                                         >
                                             Login
                                         </Link>
                                     </p>
                                 </div>
                             </div>
                         </div>

                     </div>

                     {/!* Footer *!/}
                     <div className="py-4 sm:py-6 text-center">
                         <p className="text-xs sm:text-sm text-gray-500">
                             © {new Date().getFullYear()} IBanking. All rights reserved.
                         </p>
                     </div>
                 </div>

                 {/!* Loading Overlay *!/}
                 {isSubmitting && (
                     <div
                         className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div
                             className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-white/30 relative overflow-hidden">

                             {/!* Animated background gradient *!/}
                             <div
                                 className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 animate-pulse"></div>

                             {/!* Enhanced spinner with multiple rings *!/}
                             <div className="relative mb-6">
                                 <div
                                     className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-transparent border-t-cyan-500 border-r-cyan-400"></div>
                                 <div
                                     className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-300"
                                     style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                                 <div
                                     className="absolute inset-4 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
                             </div>

                             {/!* Enhanced text with subtle animations *!/}
                             <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 text-center">
                                 Setting your Password
                                 <span className="inline-block animate-pulse">...</span>
                             </h3>

                             <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4">
                                 Please wait while we securely update your password
                             </p>

                             {/!* Progress indicator *!/}
                             <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                                 <div
                                     className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse"
                                     style={{width: '70%'}}></div>
                             </div>

                             {/!* Status text *!/}
                             <p className="text-xs text-gray-500 text-center animate-pulse">
                                 Updating your password...
                             </p>

                             {/!* Decorative elements *!/}
                             <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                             <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
                                  style={{animationDelay: '0.5s'}}></div>
                         </div>
                     </div>
                 )}
             </div>

         </section>
 */

        /*<section className="group">
            <div className="container-fluid">
                <div className="min-h-screen md:overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
                    <div className="relative z-50 col-span-12">
                        <div
                            className="w-full bg-white/80 backdrop-blur-sm md:p-12 place-content-center min-h-screen flex items-center">
                            <div className="flex flex-col w-full max-w-md mx-auto px-6">
                                {/!* Logo Section *!/}
                                <div className="mx-auto mb-8">
                                    <a href="#" className="flex items-center justify-center">
                                        <Image
                                            width={60}
                                            height={60}
                                            src="/images/logo.svg"
                                            alt="IBanking Logo"
                                            className="mr-3"
                                        />
                                        <span className="text-2xl font-bold text-gray-800">Minia</span>
                                    </a>
                                </div>

                                {/!* Form Card *!/}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                    <div className="mb-3">
                                        <div className="text-center mb-8">
                                            <div
                                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-green-600" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                            </div>
                                            <h5 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h5>
                                            <p className="text-gray-600">Create your own desired password.</p>
                                        </div>

                                        <form className="space-y-6" onSubmit={SetPasswordForm.handleSubmit} action="#">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800 font-medium placeholder:font-normal placeholder:text-gray-400 ${
                                                            SetPasswordForm.errors.password && SetPasswordForm.touched.password
                                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                                : "border-gray-300 focus:border-blue-500"
                                                        }`}
                                                        placeholder="Enter password"
                                                        onChange={SetPasswordForm.handleChange}
                                                        onBlur={SetPasswordForm.handleBlur}
                                                        value={SetPasswordForm.values.password}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <svg
                                                            className={`w-5 h-5 ${SetPasswordForm.errors.password && SetPasswordForm.touched.password ? 'text-red-400' : 'text-gray-400'}`}
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {SetPasswordForm.errors.password && SetPasswordForm.touched.password && (
                                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {SetPasswordForm.errors.password}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-800 font-medium placeholder:font-normal placeholder:text-gray-400 ${
                                                            SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword
                                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                                : "border-gray-300 focus:border-blue-500"
                                                        }`}
                                                        placeholder="Confirm password"
                                                        onChange={SetPasswordForm.handleChange}
                                                        onBlur={SetPasswordForm.handleBlur}
                                                        value={SetPasswordForm.values.confirmPassword}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <svg
                                                            className={`w-5 h-5 ${SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword ? 'text-red-400' : 'text-gray-400'}`}
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword && (
                                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {SetPasswordForm.errors.confirmPassword}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                        SetPasswordForm.isSubmitting
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5"
                                                    }`}
                                                    disabled={SetPasswordForm.isSubmitting}
                                                    type="submit"
                                                >
                                                    {SetPasswordForm.isSubmitting ? (
                                                        <div className="flex items-center justify-center">
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor"
                                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </div>
                                                    ) : (
                                                        "Set Password"
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="pt-2 mt-5 text-center">
                                            <div></div>
                                            <div className="flex justify-center gap-3"></div>
                                        </div>
                                    </div>
                                </div>

                                {/!* Footer *!/}
                                <div className="text-center mt-8">
                                    <p className="text-gray-500 text-sm">
                                        © {year} IBanking. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>*/

    );
}
