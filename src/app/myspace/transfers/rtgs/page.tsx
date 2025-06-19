'use client';

import {useEffect, useState} from "react";
import {axiosClient} from "@/endpoints/api";
import {showToast} from "@/shared/utilities/commons";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/navigation";

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
    const [loading, setLoading] = useState(false);
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

                const {data}  =  await axiosClient.post(`v1/transactions/zipit-transfer-funds/pre-auth`, payload);

                if (data?.preAuthToken != null) {
                    setPreAuthToken(data?.preAuthToken);
                    setIsSubmitting(false);


                } else {
                    setIsSubmitting(false);
                    showToast("Zipit Transfer failed", 'error');
                }
            }catch(err:any){
                setIsSubmitting(false);
                showToast(err?.response?.data?.message, 'error');

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
        <section className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header with Icon */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-600"
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
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">RTGS Transfer</h2>
                            <p className="text-sm text-gray-500">Securely transfer between accounts</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
        Transfer Money
      </span>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="p-6 md:p-8 lg:p-10">
                        <form onSubmit={preAuthForm.handleSubmit} className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Source Account */}
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Source Account
                                    </label>
                                    <select
                                        name="sourceAccountNumber"
                                        className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                                    {preAuthForm.errors.sourceAccountNumber && preAuthForm.touched.sourceAccountNumber && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {preAuthForm.errors.sourceAccountNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Recipient Account */}
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Recipient Account
                                    </label>
                                    <input
                                        name="recipientAccountNumber"
                                        className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                                    {preAuthForm.errors.recipientAccountNumber && preAuthForm.touched.recipientAccountNumber && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {preAuthForm.errors.recipientAccountNumber}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Amount */}
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                                        <input
                                            name="amount"
                                            className={`w-full pl-8 pr-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                                        <p className="mt-1 text-sm text-red-600">
                                            {preAuthForm.errors.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Narration
                                    </label>
                                    <input
                                        name="description"
                                        className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                                    {preAuthForm.errors.description && preAuthForm.touched.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {preAuthForm.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8">
                                <button
                                    className={`w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-300 text-white font-medium rounded-lg shadow-md hover:from-cyan-400 hover:to-blue-200-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                                        preAuthForm.isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                    disabled={preAuthForm.isSubmitting}
                                    type="submit"
                                >
                                    {preAuthForm.isSubmitting ? (
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
                                        "Transfer Now"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-sm">
                        <div
                            className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Processing your transfer ....</h3>
                        <p className="text-gray-600 text-center">Please wait while we process your transaction</p>
                    </div>
                </div>
            )}
        </section>

    );
}