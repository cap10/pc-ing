
'use client';

import {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginAxiosClient} from "@/endpoints/loginApi";
import {useRouter} from "next/navigation";
import {
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaIdCard,
    FaKey,
    FaLocationArrow,
    FaLock,
    FaPhone,
    FaRoad,
    FaUser,
    FaUserAlt,
    FaUserShield,
} from 'react-icons/fa';
import {FaMapLocation} from "react-icons/fa6";
import {ToastNotification} from "../../notification";
import Image from "next/image";

export default function agentSelfRegister() {

    const [myAccs, setMyAccs] = useState<any[]>([]);
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'; show: boolean} | null>(null);

    // Helper function to show toast
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, show: true });
        setTimeout(() => setToast(null), 5000);
    };


    // Step 1 validation schema
    const step1ValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name required'),
        lastName: Yup.string().required('Last name required'),
        email: Yup.string().email("Invalid email").required('Email required'),
        street: Yup.string().required('Street required'),
        suburb: Yup.string().required('Suburb required'),
        city: Yup.string().required('City required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(9, 'Phone number must have at least 9 digits')
            .max(12, 'Mobile number cannot exceed 12 digits')
            .required('Phone number required'),
        nationalId: Yup.string().required('National ID required'),
        numberOfRequiredApproversPerTransaction: Yup.string().required('Approvers number required'),
    });

    // Step 2 validation schema
    const step2ValidationSchema = Yup.object().shape({
        username: Yup.string().required('Username required'),
        password: Yup.string()
            .required('Password required')
            .min(12, 'Password must be at least 12 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[!@#$%^&*()_+\-=\[\]{}|;':"\\|.,?]/, 'Password must contain at least one special character')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number'),
        confirmPassword: Yup.string()
            .required('Please confirm password')
            .oneOf([Yup.ref('password')], 'Passwords do not match'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            street: '',
            suburb: '',
            city: '',
            email: '',
            username: '',
            phoneNumber: '',
            nationalId: '',
            numberOfRequiredApproversPerTransaction: '',
            password: '',
            confirmPassword: '',
            description: ''
        },
        validationSchema: step === 1 ? step1ValidationSchema : step1ValidationSchema.concat(step2ValidationSchema),
        onSubmit: async (values, { resetForm }) => {
            // Only submit when on step 2 and submit button is clicked
            if (step !== 2) return;

            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                address:[
                    {
                        street: values.street,
                        suburb: values.suburb,
                        city: values.city
                    }
                ],
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
                setIsSubmitting(true);
                const { data } = await loginAxiosClient.post('v1/individual-customers', payload);

                if (data) {
                    setIsSubmitting(false);
                    showToast('Agent created successfully. Visit your email for account activation', 'success');
                    resetForm();
                    await router.push('/login');
                }
            } catch (err: any) {
                setIsSubmitting(false);
                showToast(err?.response?.data?.message || 'Registration failed', 'error');
            }
        }
    });

    // Validate current step before allowing proceed
    const validateCurrentStep = async () => {
        const errors = await formik.validateForm();
        const step1Fields = [
            'customerName', 'email', 'address',
            'phoneNumber', 'nationalId', 'numberOfRequiredApproversPerTransaction','street', 'suburb','city'
        ];

        if (step === 1) {
            const step1Errors = Object.keys(errors).filter(key => step1Fields.includes(key));
            if (step1Errors.length === 0) {
                setStep(2);
            }
        }
    };

    // Only enable proceed if current step is valid
    useEffect(() => {
        const checkStepValidity = async () => {
            const errors = await formik.validateForm();
            const currentStepFields = step === 1 ? [
                'customerName', 'email', 'address',
                'phoneNumber', 'nationalId', 'numberOfRequiredApproversPerTransaction'
            ] : ['password', 'confirmPassword'];

            const hasErrors = currentStepFields.some(field => errors[field]);
            setCanProceed(!hasErrors);
        };

        checkStepValidity();
    }, [formik.values, step]);

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(1);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        formik.setFieldValue('phoneNumber', value);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Toast Notification */}
            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex items-center justify-center">
                <Image
                    width={280}
                    height={95}
                    src="/images/logo.svg"
                    alt="Minia Logo"
                    className="m-5"
                />

            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <h1 className="text-3xl font-bold text-center">Agent Registration</h1>
                    <p className="text-center text-blue-100 mt-2">
                        Complete all steps to create your account
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-6">
                    {/* Progress indicator */}
                    <div className="relative mb-12">
                        {/* Progress line with subtle glow effect */}
                        <div
                            className="absolute top-1/2 left-0 right-0 h-2 bg-gray-100 rounded-full -translate-y-1/2 z-0 shadow-inner"></div>
                        <div
                            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -translate-y-1/2 z-10 transition-all duration-500 ease-out"
                            style={{width: step === 1 ? '50%' : '100%'}}
                        ></div>

                        {/* Steps with enhanced visual hierarchy */}
                        <div className="flex justify-between relative z-20">
                            {[1, 2].map((stepNumber) => (
                                <div key={stepNumber} className="flex flex-col items-center">
                                    {/* Step circle with subtle animation */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                                            step >= stepNumber
                                                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/50 transform hover:scale-105'
                                                : 'bg-white border-3 border-gray-200 text-gray-400'
                                        }`}
                                    >
                                        {stepNumber}
                                        {/* Checkmark for completed steps */}
                                        {step > stepNumber && (
                                            <svg
                                                className="absolute w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="3"
                                                    d="M5 13l4 4L19 7"
                                                ></path>
                                            </svg>
                                        )}
                                    </div>

                                    {/* Step label with better typography */}
                                    <p
                                        className={`text-sm font-medium mt-3 transition-colors duration-300 ${
                                            step >= stepNumber
                                                ? 'text-blue-600 font-semibold'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {stepNumber === 1 ? 'Agent Details' : 'Login Credentials'}
                                    </p>

                                    {/* Optional connector line for multi-step versions */}
                                    {stepNumber < 2 && (
                                        <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Enter Agent Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 text-blue-600"/>
                                            First Name*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="firstName"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.firstName && formik.touched.firstName
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.firstName}
                                        />
                                    </div>
                                    {formik.errors.firstName && formik.touched.firstName && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 text-blue-600"/>
                                            Last Name*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="lastName"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.lastName && formik.touched.lastName
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.lastName}
                                        />
                                    </div>
                                    {formik.errors.lastName && formik.touched.lastName && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaEnvelope className="mr-2 text-blue-600"/>
                                            Email*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="email"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.email && formik.touched.email
                                                    ? "border-red-500 focus:ring-red-200"
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

                                {/* Phone Number */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaPhone className="mr-2 text-blue-600"/>
                                            Phone Number*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="phoneNumber"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.phoneNumber && formik.touched.phoneNumber
                                                    ? "border-red-500 focus:ring-red-200"
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* National ID */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaIdCard className="mr-2 text-blue-600"/>
                                            National ID*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaIdCard className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="nationalId"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.nationalId && formik.touched.nationalId
                                                    ? "border-red-500 focus:ring-red-200"
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

                                {/* No. of Approvers */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaUserShield className="mr-2 text-blue-600"/>
                                            No. of Approvers*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUserShield className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="numberOfRequiredApproversPerTransaction"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.numberOfRequiredApproversPerTransaction &&
                                                formik.touched.numberOfRequiredApproversPerTransaction
                                                    ? "border-red-500 focus:ring-red-200"
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
                            </div>

                            {/* Address Section */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Address Details</h2>
                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Street */}
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <FaRoad className="mr-2 text-blue-600"/>
                                                    Street*
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaRoad className="text-gray-400"/>
                                                </div>
                                                <input
                                                    name="street"
                                                    className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                        formik.errors.street && formik.touched.street
                                                            ? "border-red-500 focus:ring-red-200"
                                                            : "border-gray-300"
                                                    }`}
                                                    type="text"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.street}
                                                />
                                            </div>
                                            {formik.errors.street && formik.touched.street && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.street}</div>
                                            )}
                                        </div>

                                        {/* Suburb */}
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <FaLocationArrow className="mr-2 text-blue-600"/>
                                                    Suburb*
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLocationArrow className="text-gray-400"/>
                                                </div>
                                                <input
                                                    name="suburb"
                                                    className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                        formik.errors.suburb && formik.touched.suburb
                                                            ? "border-red-500 focus:ring-red-200"
                                                            : "border-gray-300"
                                                    }`}
                                                    type="text"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.suburb}
                                                />
                                            </div>
                                            {formik.errors.suburb && formik.touched.suburb && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.suburb}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <FaMapLocation className="mr-2 text-blue-600"/>
                                                City*
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaMapLocation className="text-gray-400"/>
                                            </div>
                                            <input
                                                name="city"
                                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    formik.errors.city && formik.touched.city
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-300"
                                                }`}
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.city}
                                            />
                                        </div>
                                        {formik.errors.city && formik.touched.city && (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create Login
                                Credentials</h2>

                            {/* Username */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaUserAlt className="mr-2 text-blue-600"/>
                                        Username*
                                    </div>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserAlt className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="username"
                                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formik.errors.username && formik.touched.username
                                                ? "border-red-500 focus:ring-red-200"
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

                            {/* Password */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaLock className="mr-2 text-blue-600"/>
                                        Password*
                                    </div>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="password"
                                        className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formik.errors.password && formik.touched.password
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300"
                                        }`}
                                        type={showPassword ? "text" : "password"}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="text-gray-400 hover:text-gray-600"/>
                                        ) : (
                                            <FaEye className="text-gray-400 hover:text-gray-600"/>
                                        )}
                                    </div>
                                </div>
                                {formik.errors.password && formik.touched.password && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Password must be at least 12 characters with uppercase, lowercase letters, number
                                    and a special character
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaKey className="mr-2 text-blue-600"/>
                                        Confirm Password*
                                    </div>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaKey className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formik.errors.confirmPassword && formik.touched.confirmPassword
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300"
                                        }`}
                                        type={showConfirmPassword ? "text" : "password"}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="text-gray-400 hover:text-gray-600"/>
                                        ) : (
                                            <FaEye className="text-gray-400 hover:text-gray-600"/>
                                        )}
                                    </div>
                                </div>
                                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            disabled={step === 1 || formik.isSubmitting}
                            className={`py-3 px-6 rounded-lg font-medium transition-colors ${
                                step === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Previous
                        </button>

                        {step < 2 ? (
                            <button
                                type="button"
                                onClick={validateCurrentStep}
                                disabled={!canProceed || formik.isSubmitting}
                                className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!canProceed || formik.isSubmitting}
                                className="py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formik.isSubmitting ? (
                                    <span className="flex items-center justify-center">
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  ></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-sm">
                        <div
                            className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Processing Registration</h3>
                        <p className="text-gray-600 text-center">Please wait while we process your agent
                            registration</p>
                    </div>
                </div>
            )}
        </div>
    );
};