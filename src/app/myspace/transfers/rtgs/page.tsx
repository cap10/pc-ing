'use client';

import {useEffect, useState} from "react";
import {axiosClient} from "@/endpoints/api";
import {showToast} from "@/shared/utilities/commons";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {ClockIcon, XCircleIcon} from "@heroicons/react/16/solid";

const preAuthValidationSchema = Yup.object({
    sourceAccountNumber: Yup.string().required('source Account required'),
    recipientAccountNumber: Yup.string().required('recipient Account required'),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .required('Amount is required'),
    description: Yup.string().required('description required'),

});

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function RTGSTransfer() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [trxnTypes,  setTrxnTypes] = useState<any>([]);
    const [banks,  setBanks] = useState<any>([]);
    const [requestId,  setRequestId] = useState<any>(null);
    const [preAuthToken,  setPreAuthToken] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);

    const router = useRouter();

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
            })
            .catch((err:any) => {

                showToast("Failed to fetch accounts", 'error');
            });

        //get trxn types
        axiosClient.get(`v1/transaction-types`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setTrxnTypes(res.data);
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
            })
            .catch((err:any) => {

                showToast("Failed to fetch accounts", 'error');
            });

    }, []);

    const generateRandomString = (length = 12) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        return result;
    };

    let ZipitTransaction;
    trxnTypes.forEach(function(trxn){

        if (trxn?.name === "RTGS"){
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

                const {data}  =  await axiosClient.post(`v1/transactions/rtgs-transfer-funds/pre-auth`, payload);

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
        <section
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
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
                                    {/* Success Icon with Animation */}
                                    <div
                                        className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 animate-bounce shadow-lg">
                                        <CheckCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse"/>
                                    </div>

                                    <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                                        Transaction Successful!
                                    </DialogTitle>

                                    <div
                                        className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>

                                    <div className="space-y-3 mb-6">
                                        <p className="text-sm sm:text-base text-green-700 font-medium">
                                            Your data purchase has been completed successfully.
                                        </p>

                                        <div
                                            className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Amount:</span>
                                                    <span className="font-semibold text-green-700">USD 789</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className="font-semibold text-green-700">Completed</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Reference:</span>
                                                    <span className="font-semibold text-green-700">#TXN123456</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-green-600">
                                            You will receive a confirmation SMS shortly.
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
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                                        Transaction Failed
                                    </DialogTitle>

                                    <div
                                        className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>

                                    <div className="space-y-3 mb-6">
                                        <p className="text-sm sm:text-base text-red-700 font-medium">
                                            We couldn't complete your rtgs transfer.
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
                                                    <span
                                                        className="font-semibold text-red-700">Insufficient Balance</span>
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                                </svg>
                                                <p className="text-xs sm:text-sm text-amber-700">
                                                    Please check your account balance and try again.
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
                {/* Enhanced Header with Icon */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">RTGS
                                Transfer</h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Securely transfer between
                                accounts</p>
                        </div>
                    </div>
                    <span
                        className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs sm:text-sm font-semibold rounded-full border border-cyan-200 shadow-sm">
            Transfer Money
          </span>
                </div>

                {/* Form Container */}
                <div
                    className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom duration-700">
                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                {/* Source Account */}
                                <div className="mb-5 space-y-2">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                            </svg>
                                            Source Account
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                            </svg>
                                        </div>
                                        <select
                                            name="sourceAccountNumber"
                                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                preAuthForm.errors.sourceAccountNumber && preAuthForm.touched.sourceAccountNumber
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            required
                                            onChange={preAuthForm.handleChange}
                                            onBlur={preAuthForm.handleBlur}
                                            value={preAuthForm.values.sourceAccountNumber}
                                        >
                                            <option value="">Select your account...</option>
                                            {accounts?.map((account: any) => (
                                                <option
                                                    key={account?.id}
                                                    value={account?.accountNumber}
                                                >
                                                    {account?.accountName} - {account?.accountNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {preAuthForm.errors.sourceAccountNumber && preAuthForm.touched.sourceAccountNumber && (
                                        <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top duration-200">
                                            {preAuthForm.errors.sourceAccountNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Recipient Account */}
                                <div className="mb-5 space-y-2">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            Recipient Account
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <input
                                            name="recipientAccountNumber"
                                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                preAuthForm.errors.recipientAccountNumber && preAuthForm.touched.recipientAccountNumber
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            placeholder="0011122233"
                                            required
                                            onChange={preAuthForm.handleChange}
                                            onBlur={preAuthForm.handleBlur}
                                            value={preAuthForm.values.recipientAccountNumber}
                                        />
                                    </div>
                                    {preAuthForm.errors.recipientAccountNumber && preAuthForm.touched.recipientAccountNumber && (
                                        <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top duration-200">
                                            {preAuthForm.errors.recipientAccountNumber}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                {/* Amount */}
                                <div className="mb-5 space-y-2">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                            </svg>
                                            Amount
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <span
                                            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">$</span>
                                        <input
                                            name="amount"
                                            className={`w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                preAuthForm.errors.amount && preAuthForm.touched.amount
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            type="number"
                                            placeholder="0.00"
                                            required
                                            onChange={preAuthForm.handleChange}
                                            onBlur={preAuthForm.handleBlur}
                                            value={preAuthForm.values.amount}
                                        />
                                    </div>
                                    {preAuthForm.errors.amount && preAuthForm.touched.amount && (
                                        <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top duration-200">
                                            {preAuthForm.errors.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-5 space-y-2">
                                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                            Narration
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                        </div>
                                        <input
                                            name="description"
                                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
                                                preAuthForm.errors.description && preAuthForm.touched.description
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            placeholder="e.g. Zipit transfer"
                                            required
                                            onChange={preAuthForm.handleChange}
                                            onBlur={preAuthForm.handleBlur}
                                            value={preAuthForm.values.description}
                                        />
                                    </div>
                                    {preAuthForm.errors.description && preAuthForm.touched.description && (
                                        <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top duration-200">
                                            {preAuthForm.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 lg:mt-10">
                                <button
                                    className={`w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                        preAuthForm.isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                    disabled={preAuthForm.isSubmitting}
                                    type="submit"
                                    onClick={preAuthForm.handleSubmit}
                                >
                                    {preAuthForm.isSubmitting ? (
                                        <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                                        <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      Transfer Now
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>
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
                            Processing your transfer
                            <span className="inline-block animate-pulse">...</span>
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4">
                            Please wait while we securely process your transaction
                        </p>

                        {/* Progress indicator */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse"
                                style={{width: '70%'}}></div>
                        </div>

                        {/* Status text */}
                        <p className="text-xs text-gray-500 text-center animate-pulse">
                            Verifying transaction details...
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
                             style={{animationDelay: '0.5s'}}></div>
                    </div>
                </div>
            )}
        </section>

    );
}