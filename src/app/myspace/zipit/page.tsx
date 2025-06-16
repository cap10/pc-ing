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
    destinationBin: Yup.string().required('Destination bin required'),

});

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function ZipitTransfer() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [trxnTypes,  setTrxnTypes] = useState<any>([]);
    const [banks,  setBanks] = useState<any>([]);
    const [requestId,  setRequestId] = useState<any>(null);
    const [preAuthToken,  setPreAuthToken] = useState<any>(null);
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

        if (trxn?.name === "Zipit Send"){
            //get the and save it
            ZipitTransaction = trxn?.id;
        }

    });

    const preAuthForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

            const randomString = generateRandomString();
            setRequestId(randomString);

            const payload =  {
                requestId: randomString,
                sourceAccountNumber: values.sourceAccountNumber,
                recipientAccountNumber: values.recipientAccountNumber,
                amount: values.amount,
                transactionTypeId: ZipitTransaction,
                description: values.description,
                destinationBin: values.destinationBin,
            }

            try {

                const {data}  =  await axiosClient.post(`v1/transactions/zipit-transfer-funds/pre-auth`, payload);

                if (data?.preAuthToken != null) {
                    setPreAuthToken(data?.preAuthToken);

                } else {
                    showToast("Zipit Transfer failed", 'error');
                }
            }catch(err:any){
                showToast(err?.response?.data?.message, 'error');

            }
        },

        initialValues: {
            sourceAccountNumber: '',
            recipientAccountNumber: '',
            amount: '',
            description: '',
            destinationBin: '',
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
        <section className="group">
            <div className="container-fluid">
                <div className="md:flex items-center justify-between px-[2px] mb-5">
                    <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">ZIPIT
                        Transfer</h4>
                    <p className="p-1 text-color-secondary bg-color-primary rounded-md">Transfer
                        Money</p>
                </div>
                <div className="h-screen">
                    <div className="relative z-50 col-span-12">
                        <div className="w-full bg-white md:p-12 place-content-center">
                            <div className="flex h-[100vh] flex-col w-10/12 lg:w-8/12 m-auto">

                                <form onSubmit={preAuthForm.handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-700">Source
                                                Acc#</label>
                                            <select
                                                name="sourceAccountNumber"
                                                className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                                    preAuthForm.errors.sourceAccountNumber && preAuthForm.touched.sourceAccountNumber
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                type="text"
                                                placeholder="001122233344"
                                                required
                                                onChange={preAuthForm.handleChange}
                                                onBlur={preAuthForm.handleBlur}
                                                value={preAuthForm.values.sourceAccountNumber}
                                            >
                                                <option value="" defaultValue={""}>Please Choose...</option>
                                                {accounts?.map((account: any) => (
                                                    <option key={account?.id}
                                                            value={account?.accountNumber}>{account?.accountName} - {account?.accountNumber}</option>
                                                ))}
                                            </select>
                                            {preAuthForm.errors.sourceAccountNumber && preAuthForm.touched.sourceAccountNumber && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {preAuthForm.errors.sourceAccountNumber}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600">Recipient
                                                Acc#</label>
                                            <input
                                                name="recipientAccountNumber"
                                                className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
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
                                                <div className="text-red-500 text-sm mt-1">
                                                    {preAuthForm.errors.recipientAccountNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600">Amount</label>
                                            <input
                                                name="amount"
                                                className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
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
                                            {preAuthForm.errors.amount && preAuthForm.touched.amount && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {preAuthForm.errors.amount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600">Description</label>
                                            <input
                                                name="description"
                                                className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                                    preAuthForm.errors.description && preAuthForm.touched.description
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                type="text"
                                                placeholder="zipit transfer"
                                                required
                                                onChange={preAuthForm.handleChange}
                                                onBlur={preAuthForm.handleBlur}
                                                value={preAuthForm.values.description}
                                            />
                                            {preAuthForm.errors.description && preAuthForm.touched.description && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {preAuthForm.errors.description}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                    <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-700">Destination
                                                Bank</label>
                                            <select
                                                name="destinationBin"
                                                className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                                    preAuthForm.errors.destinationBin && preAuthForm.touched.destinationBin
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                required
                                                onChange={preAuthForm.handleChange}
                                                onBlur={preAuthForm.handleBlur}
                                                value={preAuthForm.values.destinationBin}
                                            >
                                                <option value="" defaultValue={""}>Please Choose...</option>
                                                {banks?.map((bank: any) => (
                                                    <option key={bank?.id}
                                                            value={bank?.bin}>{bank?.bankName}</option>
                                                ))}
                                            </select>
                                            {preAuthForm.errors.destinationBin && preAuthForm.touched.destinationBin && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {preAuthForm.errors.destinationBin}
                                                </div>
                                            )}
                                        </div>

                                    <div className="mb-6">
                                        <div className="mb-3 mt-4">
                                            <button
                                                className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600"
                                                disabled={preAuthForm.isSubmitting}
                                                type="submit"
                                            >
                                                {preAuthForm.isSubmitting ? "Processing..." : "Zipit Transfer"}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
        ;
}