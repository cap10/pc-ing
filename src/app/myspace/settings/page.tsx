'use client';

import React, {useEffect, useState} from "react";
import {axiosClient} from "@/endpoints/api";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {ShieldCheckIcon, XCircleIcon} from "@heroicons/react/16/solid";
import {generateRandomString} from "@/app/random-generator";
import {
    User,
    Mail,
    Phone,
    Bell,
    Lock,
    ShieldCheck,
    CheckCircle,
    XCircle
} from 'lucide-react';


function CheckboxField({ name, label, description, checked, onChange, icon: Icon }) {
    return (
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center h-5">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded transition-all duration-200"
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <label htmlFor={name} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {label}
                    </label>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}
const preAuthValidationSchema = Yup.object({
    sourceAccountNumber: Yup.string().required('source Account required'),
    recipientAccountNumber: Yup.string().required('recipient Account required'),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .required('Amount is required'),
    description: Yup.string().required('description required'),

});


export default function InternalTransfer() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [trxnTypes,  setTrxnTypes] = useState<any>([]);
    const [banks,  setBanks] = useState<any>([]);
    const [requestId,  setRequestId] = useState<any>(null);
    const [preAuthToken,  setPreAuthToken] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'; show: boolean} | null>(null);
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);

    // Helper function to show toast
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, show: true });
        setTimeout(() => setToast(null), 5000);
    };

    let customerId:any;

    if ( typeof window !== 'undefined') {
        // Perform localStorage action
        customerId = sessionStorage.getItem('customerId');
    }

    useEffect(() => {
        //get customers
        axiosClient.get(`v1/customer-accounts/customers?customerId=${customerId}`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setAccounts(res.data);
                setLoading(false);
            })
            .catch((err:any) => {

                showToast("Failed to fetch accounts", 'error');
            });

        //get trxn types
        axiosClient.get(`v1/transaction-types`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setTrxnTypes(res.data);
                setLoading(false);
            })
            .catch((err:any) => {

                showToast("Failed to fetch accounts", 'error');
            });

        //get banks
        axiosClient.get(`v1/banks`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setBanks(res.data);
                console.log("Banks", res.data);
                setLoading(false);
            })
            .catch((err:any) => {

                showToast("Failed to fetch accounts", 'error');
            });

    }, []);

    let ZipitTransaction;
    trxnTypes.forEach(function(trxn){

        if (trxn?.name === "Zipit Send"){
            //get the and save it
            ZipitTransaction = trxn?.id;
        }

    });

    const preAuthForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {
            setIsSubmitting(true);

            const randomString = generateRandomString();
            setRequestId(randomString);

            const payload =  {
                requestId: randomString,
                sourceAccountNumber: values.sourceAccountNumber,
                recipientAccountNumber: values.recipientAccountNumber,
                amount: values.amount,
                transactionTypeId: ZipitTransaction,
                description: values.description,
            }

            try {

                const {data}  =  await axiosClient.post(`v1/transactions/zipit-transfer-funds/pre-auth`, payload);

                if (data?.preAuthToken != null) {
                    setPreAuthToken(data?.preAuthToken);
                    setIsSubmitting(false);
                    setSuccessOpen(true);

                } else {
                    setIsSubmitting(false);
                    setFailureOpen(true);
                }
            }catch(err:any){
                setIsSubmitting(false);
                const errorMessage = err?.response?.data?.message || "An unexpected error occurred";
                setFailureOpen(true);

            }

        },

        initialValues: {
            sourceAccountNumber: '',
            recipientAccountNumber: '',
            amount: '',
            description: '',
        },
        validationSchema: preAuthValidationSchema,
    });

    const authZipit = async () => {

        const payload = {
            requestId: requestId,
            preAuthToken: preAuthToken,
        }

        try {

            const {data} = await axiosClient.post(`v1/transactions/zipit-transfer-funds/auth`, payload);

            if (data?.preAuthToken != null) {
                showToast("Zipit Transfer success", 'success');

            } else {
                showToast("Zipit Transfer failed", 'error');
            }
        } catch (err: any) {
            showToast(err?.response?.data?.message, 'error');

        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"></div>
            </div>

            {/* Success Modal */}
            {successOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-green-200/50">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                            <div className="text-center">
                                <div
                                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 animate-bounce shadow-lg">
                                    <CheckCircle className="h-10 w-10 text-white animate-pulse"/>
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">Profile Updated!</h3>
                                <div
                                    className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>
                                <p className="text-green-700 font-medium mb-6">Your profile has been updated
                                    successfully.</p>
                                <button
                                    onClick={() => setSuccessOpen(false)}
                                    className="w-full inline-flex justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2"/>
                                    Great, Thanks!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Failure Modal */}
            {failureOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-red-200/50">
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6">
                            <div className="text-center">
                                <div
                                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mb-4 animate-pulse shadow-lg">
                                    <XCircle className="h-10 w-10 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-2">Update Failed</h3>
                                <div
                                    className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>
                                <p className="text-red-700 font-medium mb-6">We couldn't update your profile. Please try
                                    again.</p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setFailureOpen(false)}
                                        className="flex-1 inline-flex justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-300 ring-inset hover:bg-gray-50 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setFailureOpen(false)}
                                        className="flex-1 inline-flex justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
                {/* Header */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                            <User className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Profile Settings
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">Manage your account preferences</p>
                        </div>
                    </div>
                    <span
                        className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-sm font-semibold rounded-full border border-cyan-200 shadow-sm">
            Account Settings
          </span>
                </div>

                <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-100 to-blue-100  p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                                    <User className="h-6 w-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                    <p className="text-sm text-gray-600">Update your personal details</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* User Info Display */}
                            <div
                                className="mb-6 p-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg border border-gray-400">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md">
                                        <User className="h-5 w-5 text-white"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Petros Timbsony</h4>
                                        <p className="text-sm text-gray-600">Merchant Account</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-cyan-500"/>
                                                First Name
                                            </div>
                                        </label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02]"
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-cyan-500"/>
                                                Last Name
                                            </div>
                                        </label>
                                        <input
                                            name="lastName"
                                            type="text"
                                            
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02]"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-cyan-500"/>
                                            Email Address
                                        </div>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02]"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                      <User className="w-5 h-5 mr-2"/>
                      Update Personal Info
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-100 to-indigo-100">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                    <Bell className="h-6 w-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                                    <p className="text-sm text-gray-600">Configure how you receive notifications</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div  className="space-y-4">
                                <CheckboxField
                                    name="emailNotifications"
                                    label="Email Notifications"
                                    description="Receive important updates via email"
                                    
                                    icon={Mail}
                                />

                                <CheckboxField
                                    name="smsAlerts"
                                    label="SMS Alerts"
                                    description="Get transaction alerts via SMS"
                                    
                                    icon={Phone}
                                />

                                <CheckboxField
                                    name="pushNotifications"
                                    label="Push Notifications"
                                    description="Receive push notifications on your device"
                                    
                                    icon={Bell}
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                      <Bell className="w-5 h-5 mr-2"/>
                      Update Notification Preferences
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="p-6 border-b bg-gradient-to-r from-green-200 to-yellow-100 border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div
                                    className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                    <ShieldCheck className="h-6 w-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                                    <p className="text-sm text-gray-600">Manage your security preferences and data
                                        privacy</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <CheckboxField
                                    name="twoFactorAuth"
                                    label="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account"
                                    
                                    icon={Lock}
                                />

                                <CheckboxField
                                    name="loginAlerts"
                                    label="Login Alerts"
                                    description="Get notified when someone logs into your account"
                                    
                                    icon={ShieldCheck}
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 mr-2"/>
                      Update Security Settings
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Loading Overlay */}
            {isSubmitting && (
                <div
                    className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-white/30 relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 animate-pulse"></div>

                        <div className="relative mb-6">
                            <div
                                className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-500 border-r-cyan-400"></div>
                            <div
                                className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-300"
                                style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                            <div
                                className="absolute inset-4 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
                        </div>

                        <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 text-center">
                            Updating Profile
                            <span className="inline-block animate-pulse">...</span>
                        </h3>

                        <p className="text-base text-gray-600 text-center leading-relaxed mb-4">
                            Please wait while we save your changes
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse"
                                style={{width: '70%'}}></div>
                        </div>

                        <p className="text-xs text-gray-500 text-center animate-pulse">
                            Saving your preferences...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}