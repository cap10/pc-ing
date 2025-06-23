
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
    FaUser,FaCheckCircle,
    FaUserAlt,
    FaUserShield,
} from 'react-icons/fa';
import {FaMapLocation} from "react-icons/fa6";
import {ToastNotification} from "../../notification";

import BackButton from "../../go-back";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {XCircleIcon} from "@heroicons/react/16/solid";

const Image = ({ width, height, src, alt, className }) => (
    <div className={`${className} bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl border border-white/20`}
         style={{ width: `${width}px`, height: `${height}px` }}>
        <span className="text-white text-2xl sm:text-3xl font-bold tracking-wide">IBanking</span>
    </div>
);

export default function agentSelfRegister() {

    const [myAccs, setMyAccs] = useState<any[]>([]);
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);

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
                        accountType: "CUSTOMER",
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
                    await router.push('/login');
                    setSuccessOpen(true);
                }
            } catch (err: any) {
                setIsSubmitting(false);
              setFailureOpen(true);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
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
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="text-center">
                                        {/* Success Icon with Animation */}
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 animate-bounce shadow-lg">
                                            <CheckCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse" />
                                        </div>

                                        <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                                            Registration Successful!
                                        </DialogTitle>

                                        <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>

                                        <div className="space-y-3 mb-6">
                                            <p className="text-sm sm:text-base text-green-700 font-medium">
                                                Your account creation completed successfully.
                                            </p>

                                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="font-semibold text-green-700">Completed</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Please check you email address to activate your account:</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-green-600">
                                                You will receive a confirmation email shortly.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSuccessOpen(false)}
                                            className="w-full inline-flex justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 sm:py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-2" />
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
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mb-4 animate-pulse shadow-lg">
                                            <XCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                        </div>

                                        <DialogTitle as="h3" className="text-lg sm:text-xl font-bold text-red-800 mb-2">
                                            Registration Failed
                                        </DialogTitle>

                                        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>

                                        <div className="space-y-3 mb-6">
                                            <p className="text-sm sm:text-base text-red-700 font-medium">
                                                We couldn't complete your account registration transfer.
                                            </p>

                                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Error Code:</span>
                                                        <span className="font-semibold text-red-700">#ERR_001</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="font-semibold text-red-700">Failed</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Reason:</span>
                                                        <span className="font-semibold text-red-700">Details already exist</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                <div className="flex items-start">
                                                    <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <p className="text-xs sm:text-sm text-amber-700">
                                                        Please check your registration details and try again.
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


                {/* Logo Section */}
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                    <Image
                        width={280}
                        height={95}
                        src="/images/logo.svg"
                        alt="Minia Logo"
                        className="text-center"
                    />
                </div>

                {/* Main Form Container */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 p-6 sm:p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2">Individual Registration</h1>
                            <p className="text-center text-cyan-50 text-sm sm:text-base lg:text-lg font-medium">
                                Complete all steps to create your account
                            </p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 lg:p-8">
                        {/* Progress indicator */}
                        <div className="relative mb-8 sm:mb-12">
                            {/* Progress line with subtle glow effect */}
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full -translate-y-1/2 z-0 shadow-inner"></div>
                            <div
                                className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full -translate-y-1/2 z-10 transition-all duration-700 ease-out shadow-sm"
                                style={{width: step === 1 ? '50%' : '100%'}}
                            ></div>

                            {/* Steps with enhanced visual hierarchy */}
                            <div className="flex justify-between relative z-20">
                                {[1, 2].map((stepNumber) => (
                                    <div key={stepNumber} className="flex flex-col items-center">
                                        {/* Step circle with subtle animation */}
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold transition-all duration-500 ${
                                                step >= stepNumber
                                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-200/50 transform hover:scale-110'
                                                    : 'bg-white border-3 border-gray-200 text-gray-400 shadow-md'
                                            }`}
                                        >
                                            {step > stepNumber ? (
                                                <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                            ) : (
                                                stepNumber
                                            )}
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
                                            className={`text-xs sm:text-sm font-medium mt-2 sm:mt-3 transition-colors duration-300 text-center max-w-20 sm:max-w-none ${
                                                step >= stepNumber
                                                    ? 'text-cyan-600 font-semibold'
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
                            <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right duration-500">
                                <BackButton/>

                                <div className="text-center mb-8">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">Enter Individual Details</h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaUser className="mr-2 text-cyan-500"/>
                                                First Name*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="firstName"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.firstName && formik.touched.firstName
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="text"
                                                placeholder="Enter your first name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.firstName}
                                            />
                                        </div>
                                        {formik.errors.firstName && formik.touched.firstName && (
                                            <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.firstName}</div>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaUser className="mr-2 text-cyan-500"/>
                                                Last Name*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="lastName"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.lastName && formik.touched.lastName
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="text"
                                                placeholder="Enter your last name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.lastName}
                                            />
                                        </div>
                                        {formik.errors.lastName && formik.touched.lastName && (
                                            <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.lastName}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaEnvelope className="mr-2 text-cyan-500"/>
                                                Email*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaEnvelope className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="email"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.email && formik.touched.email
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="email"
                                                placeholder="Enter your email address"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                            />
                                        </div>
                                        {formik.errors.email && formik.touched.email && (
                                            <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.email}</div>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaPhone className="mr-2 text-cyan-500"/>
                                                Phone Number*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaPhone className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="phoneNumber"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.phoneNumber && formik.touched.phoneNumber
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                onChange={handlePhoneNumberChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.phoneNumber}
                                                maxLength={12}
                                            />
                                        </div>
                                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                                            <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.phoneNumber}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {/* National ID */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaIdCard className="mr-2 text-cyan-500"/>
                                                National ID*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaIdCard className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="nationalId"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.nationalId && formik.touched.nationalId
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="text"
                                                placeholder="Enter your national ID"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.nationalId}
                                            />
                                        </div>
                                        {formik.errors.nationalId && formik.touched.nationalId && (
                                            <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.nationalId}</div>
                                        )}
                                    </div>

                                    {/* No. of Approvers */}
                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            <div className="flex items-center text-sm sm:text-base">
                                                <FaUserShield className="mr-2 text-cyan-500"/>
                                                No. of Approvers*
                                            </div>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                <FaUserShield className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                            </div>
                                            <input
                                                name="numberOfRequiredApproversPerTransaction"
                                                className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                    formik.errors.numberOfRequiredApproversPerTransaction &&
                                                    formik.touched.numberOfRequiredApproversPerTransaction
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                type="number"
                                                placeholder="Enter number of approvers"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.numberOfRequiredApproversPerTransaction}
                                            />
                                        </div>
                                        {formik.errors.numberOfRequiredApproversPerTransaction &&
                                            formik.touched.numberOfRequiredApproversPerTransaction && (
                                                <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">
                                                    {formik.errors.numberOfRequiredApproversPerTransaction}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="mt-8 sm:mt-12">
                                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                        <h2 className="px-4 sm:px-6 text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Address Details</h2>
                                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                            {/* Street */}
                                            <div className="space-y-2">
                                                <label className="block font-medium text-gray-700">
                                                    <div className="flex items-center text-sm sm:text-base">
                                                        <FaRoad className="mr-2 text-cyan-500"/>
                                                        Street*
                                                    </div>
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                        <FaRoad className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                                    </div>
                                                    <input
                                                        name="street"
                                                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                            formik.errors.street && formik.touched.street
                                                                ? "border-red-500 focus:ring-red-200"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                        type="text"
                                                        placeholder="Enter your street address"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.street}
                                                    />
                                                </div>
                                                {formik.errors.street && formik.touched.street && (
                                                    <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.street}</div>
                                                )}
                                            </div>

                                            {/* Suburb */}
                                            <div className="space-y-2">
                                                <label className="block font-medium text-gray-700">
                                                    <div className="flex items-center text-sm sm:text-base">
                                                        <FaLocationArrow className="mr-2 text-cyan-500"/>
                                                        Suburb*
                                                    </div>
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                        <FaLocationArrow className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                                    </div>
                                                    <input
                                                        name="suburb"
                                                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                            formik.errors.suburb && formik.touched.suburb
                                                                ? "border-red-500 focus:ring-red-200"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                        type="text"
                                                        placeholder="Enter your suburb"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.suburb}
                                                    />
                                                </div>
                                                {formik.errors.suburb && formik.touched.suburb && (
                                                    <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.suburb}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="space-y-2">
                                            <label className="block font-medium text-gray-700">
                                                <div className="flex items-center text-sm sm:text-base">
                                                    <FaMapLocation className="mr-2 text-cyan-500"/>
                                                    City*
                                                </div>
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                                    <FaMapLocation className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                                </div>
                                                <input
                                                    name="city"
                                                    className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                        formik.errors.city && formik.touched.city
                                                            ? "border-red-500 focus:ring-red-200"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                    type="text"
                                                    placeholder="Enter your city"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.city}
                                                />
                                            </div>
                                            {formik.errors.city && formik.touched.city && (
                                                <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.city}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-left duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">Create Login Credentials</h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="block font-medium text-gray-700">
                                        <div className="flex items-center text-sm sm:text-base">
                                            <FaUserAlt className="mr-2 text-cyan-500"/>
                                            Username*
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <FaUserAlt className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                        </div>
                                        <input
                                            name="username"
                                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                formik.errors.username && formik.touched.username
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            type="text"
                                            placeholder="Choose a username"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.username}
                                        />
                                    </div>
                                    {formik.errors.username && formik.touched.username && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.username}</div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="block font-medium text-gray-700">
                                        <div className="flex items-center text-sm sm:text-base">
                                            <FaLock className="mr-2 text-cyan-500"/>
                                            Password*
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                        </div>
                                        <input
                                            name="password"
                                            className={`w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                formik.errors.password && formik.touched.password
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a secure password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-gray-400 hover:text-cyan-500 transition-colors w-4 h-4 sm:w-5 sm:h-5"/>
                                            ) : (
                                                <FaEye className="text-gray-400 hover:text-cyan-500 transition-colors w-4 h-4 sm:w-5 sm:h-5"/>
                                            )}
                                        </div>
                                    </div>
                                    {formik.errors.password && formik.touched.password && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.password}</div>
                                    )}
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg border-l-4 border-cyan-500">
                                        Password must be at least 12 characters with uppercase, lowercase letters, number
                                        and a special character
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="block font-medium text-gray-700">
                                        <div className="flex items-center text-sm sm:text-base">
                                            <FaKey className="mr-2 text-cyan-500"/>
                                            Confirm Password*
                                        </div>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <FaKey className="text-gray-400 group-focus-within:text-cyan-500 transition-colors"/>
                                        </div>
                                        <input
                                            name="confirmPassword"
                                            className={`w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg text-sm sm:text-base ${
                                                formik.errors.confirmPassword && formik.touched.confirmPassword
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmPassword}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="text-gray-400 hover:text-cyan-500 transition-colors w-4 h-4 sm:w-5 sm:h-5"/>
                                            ) : (
                                                <FaEye className="text-gray-400 hover:text-cyan-500 transition-colors w-4 h-4 sm:w-5 sm:h-5"/>
                                            )}
                                        </div>
                                    </div>
                                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1 animate-in slide-in-from-top duration-200">{formik.errors.confirmPassword}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
                            <button
                                type="button"
                                onClick={goToPreviousStep}
                                disabled={step === 1 || formik.isSubmitting}
                                className={`w-full sm:w-auto order-2 sm:order-1 py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                                    step === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                }`}
                            >
                                Previous
                            </button>

                            {step < 2 ? (
                                <button
                                    type="button"
                                    onClick={validateCurrentStep}
                                    disabled={!canProceed || formik.isSubmitting}
                                    className="w-full sm:w-auto order-1 sm:order-2 py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!canProceed || formik.isSubmitting}
                                    className="w-full sm:w-auto order-1 sm:order-2 py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
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
                                Processing your registration
                                <span className="inline-block animate-pulse">...</span>
                            </h3>

                            <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4">
                                Please wait while we create your individual account
                            </p>

                            {/* Progress indicator */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse"
                                    style={{width: '70%'}}></div>
                            </div>

                            {/* Status text */}
                            <p className="text-xs text-gray-500 text-center animate-pulse">
                                Verifying registration details...
                            </p>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
                                 style={{animationDelay: '0.5s'}}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};