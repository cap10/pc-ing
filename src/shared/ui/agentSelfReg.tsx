/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { individualCustomerRegistrationUtil } from "../utilities/utils";
import AccountForm from "./accountForm";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginAxiosClient} from "@/endpoints/loginApi";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaIdCard,
    FaUserShield,
    FaKey,
    FaCheckCircle,
    FaHome,
    FaUserAlt,
    FaLock
} from 'react-icons/fa';

export default function IndividualSelfRegister() {

    const [myAccs, setMyAccs] = useState<any[]>([]);
    const router = useRouter();
    const [step, setStep] = useState(1);
    let myModeCount = 1;

    // Step 1 validation schema
    const step1ValidationSchema = Yup.object().shape({
        customerName: Yup.string().required('Customer name required'),
        email: Yup.string().email("Invalid email").required('Email required'),
        address: Yup.string().required('Address required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(9, 'Phone number must have at least 9 digits')
            .max(10, 'Mobile number cannot exceed 12 digits')
            .required('Phone number required'),
        nationalId: Yup.string().required('National ID required'),
        numberOfRequiredApproversPerTransaction: Yup.string().required('Approvers number required'),
    });

    // Step 2 validation schema
    const step2ValidationSchema = Yup.object().shape({
        username: Yup.string().required('Username required'),
        password: Yup.string()
            .required('Password required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number'),
        confirmPassword: Yup.string()
            .required('Please confirm password')
            .oneOf([Yup.ref('password')], 'Passwords do not match'),
    });

    // Combined validation schema
    const validationSchema = step === 1 ? step1ValidationSchema : step1ValidationSchema.concat(step2ValidationSchema);

    const formik = useFormik({
        initialValues: {
            customerName: '',
            email: '',
            address: '',
            username: '',
            phoneNumber: '',
            nationalId: '',
            numberOfRequiredApproversPerTransaction: '',
            password: '',
            confirmPassword: '',
            description: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                customerName: values.customerName,
                email: values.email,
                address: values.address,
                phoneNumber: values.phoneNumber,
                nationalId: values.nationalId,
                numberOfRequiredApproversPerTransaction: values.numberOfRequiredApproversPerTransaction,
                accounts: [
                    {
                        accountType: "AGENT",
                    }
                ],
                username: values.username,
                password: values.password
            };

            try {
                const { data } = await loginAxiosClient.post('v1/individual-customers', payload);

                if (data) {
                    showToast('Customer created successfully. Visit your email for account activation', 'success');
                    resetForm();
                    await router.push('/login');
                } else {
                    showToast(data?.message || 'An error occurred', 'error');
                }
            } catch (err: any) {
                showToast(err?.response?.data?.message || 'Registration failed', 'error');
            }
        }
    });

    // Update validation when step changes
    useEffect(() => {
        formik.validateForm();
    }, [step]);

    const goToNextStep = async () => {
        // Validate only step 1 fields before proceeding
        const step1Fields = [
            'customerName', 'email', 'address',
            'phoneNumber', 'nationalId', 'numberOfRequiredApproversPerTransaction'
        ];

        const errors = await formik.validateForm();
        const step1Errors = Object.keys(errors).filter(key => step1Fields.includes(key));

        if (step1Errors.length === 0) {
            setStep(2);
        }
    };

    const goToPreviousStep = () => {
        setStep(1);
    };

    // Prevent non-numeric input for phone number
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        formik.setFieldValue('phoneNumber', value);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-8">Agent Registration</h1>

            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                {/* Progress indicator */}
                <div className="flex mb-8">
                    <div className={`flex-1 border-t-4 pt-1 ${step >= 1 ? 'border-blue-600' : 'border-gray-300'}`}>
                        <p className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step 1: Customer Details
                        </p>
                    </div>
                    <div className={`flex-1 border-t-4 pt-1 ${step >= 2 ? 'border-blue-600' : 'border-gray-300'}`}>
                        <p className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step 2: Login Credentials
                        </p>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-center mb-8">Enter Personal Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaUser className="mr-2"/> Full Name*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="customerName"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.customerName && formik.touched.customerName
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.customerName}
                                    />
                                </div>
                                {formik.errors.customerName && formik.touched.customerName && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.customerName}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaEnvelope className="mr-2"/> Email*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="email"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.email && formik.touched.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                </div>
                                {formik.errors.email && formik.touched.email && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaPhone className="mr-2"/> Phone Number*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="phoneNumber"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.phoneNumber && formik.touched.phoneNumber
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="tel"
                                        onChange={handlePhoneNumberChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phoneNumber}
                                        maxLength={12}
                                    />
                                </div>
                                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaIdCard className="mr-2"/> National ID*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="nationalId"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.nationalId && formik.touched.nationalId
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nationalId}
                                    />
                                </div>
                                {formik.errors.nationalId && formik.touched.nationalId && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.nationalId}</div>
                                )}
                            </div>
                        </div>


                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                <FaUserShield className="mr-2"/> No. of Approvers*
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUserShield className="text-gray-400"/>
                                </div>
                                <input
                                    name="numberOfRequiredApproversPerTransaction"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.numberOfRequiredApproversPerTransaction &&
                                        formik.touched.numberOfRequiredApproversPerTransaction
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.numberOfRequiredApproversPerTransaction}
                                />
                            </div>
                            {formik.errors.numberOfRequiredApproversPerTransaction &&
                                formik.touched.numberOfRequiredApproversPerTransaction && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.numberOfRequiredApproversPerTransaction}
                                    </div>
                                )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                <FaHome className="mr-2"/> Address*
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaHome className="text-gray-400"/>
                                </div>
                                <input
                                    name="address"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.address && formik.touched.address
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                />
                            </div>
                            {formik.errors.address && formik.touched.address && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-center mb-8">Create Login Credentials</h1>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                <FaUserAlt className="mr-2"/> Username*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUserAlt className="text-gray-400"/>
                                </div>
                                <input
                                    name="username"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.username && formik.touched.username
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                />
                            </div>
                            {formik.errors.username && formik.touched.username && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                <FaLock className="mr-2"/> Password*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400"/>
                                </div>
                                <input
                                    name="password"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.password && formik.touched.password
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </div>
                            {formik.errors.password && formik.touched.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                            <p className="text-xs text-gray-500 mt-1 ml-2">
                                Password must be at least 8 characters with uppercase, lowercase letters and a number
                            </p>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                <FaKey className="mr-2"/> Confirm Password*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-gray-400"/>
                                </div>
                                <input
                                    name="confirmPassword"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.confirmPassword && formik.touched.confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                />
                            </div>
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={goToPreviousStep}
                        disabled={step === 1 || formik.isSubmitting}
                        className={`py-2 px-6 rounded-md font-medium ${
                            step === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300 disabled:text-gray-500'
                        }`}
                    >
                        Previous
                    </button>

                    {step < 2 ? (
                        <button
                            type="button"
                            onClick={goToNextStep}
                            disabled={formik.isSubmitting}
                            className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={formik.isSubmitting || !formik.isValid}
                            className="py-2 px-6 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                            ) : "Submit"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}