/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { createCorporateCustomerUtil } from "../utilities/utils";
import UserRightsForm from "./userRightsForm";
import * as Yup from "yup";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";
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
    FaLock, FaEye, FaEyeSlash, FaCalendarCheck, FaCalendarAlt, FaBuilding, FaRoad, FaLocationArrow
} from 'react-icons/fa';
import {useRouter} from "next/navigation";
import {FaMapLocation} from "react-icons/fa6";


export default function CorporateSelfRegister() {

    const router = useRouter();
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Step 1 validation schema (Business Details)
    const step1ValidationSchema = Yup.object().shape({
        companyName: Yup.string().required('Company name required'),
        email: Yup.string().email("Invalid email").required('Email required'),
        address: Yup.string().required('Address required'),
        incorporationDate: Yup.string().required('Incorp date required'),
        registrationNumber: Yup.string().required('Reg No required'),
        telephoneNumber: Yup.string().required('Telephone required'),
        street: Yup.string().required('Street required'),
        suburb: Yup.string().required('Suburb required'),
        city: Yup.string().required('City required'),
        numberOfRequiredApproversPerTransaction: Yup.string().required('Approvers number required'),
    });

// Step 2 validation schema (Contact Details)
    const step2ValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name required'),
        userRight: Yup.string().required('User right required'),
        nationalId: Yup.string().required('National ID required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(9, 'Phone number must have at least 9 digits')
            .max(12, 'Mobile number cannot exceed 12 digits')
            .required('Phone number required'),
        userEmail: Yup.string().email("Invalid email").required('Email required'),
    });

// Step 3 validation schema (Login Credentials)
    const step3ValidationSchema = Yup.object().shape({
        username: Yup.string().required('Username required'),
        password: Yup.string()
            .required('Password required')
            .min(12, 'Password must be at least 12 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[!@#$%^&*()_+\-=\[\]{}|;':"\\|.,?]/, 'Password must contain at least one special character')
            .matches(/\d/, 'Password must contain at least one number'),
        confirmPassword: Yup.string()
            .required('Please confirm password')
            .oneOf([Yup.ref('password')], 'Passwords do not match'),
    });

    const formik = useFormik({
        initialValues: {
            companyName: '',
            email: '',
            address: '',
            incorporationDate: '',
            registrationNumber: '',
            telephoneNumber: '',
            name: '',
            userRight: '',
            phoneNumber: '',
            nationalId: '',
            userEmail: '',
            numberOfRequiredApproversPerTransaction: '',
            username: '',
            password: '',
            confirmPassword: '',
            street: '',
            suburb: '',
            city: '',
        },
        validationSchema:
            step === 1 ? step1ValidationSchema :
                step === 2 ? step2ValidationSchema :
                    step3ValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            // Only submit when on step 3
            if (step !== 3) return;

            const payload = {
                companyName: values.companyName,
                email: values.email,
                incorporationDate: values.incorporationDate,
                registrationNumber: values.registrationNumber,
                telephoneNumber: values.telephoneNumber,
                numberOfRequiredApproversPerTransaction: values.numberOfRequiredApproversPerTransaction,
                userRights: [
                    {
                        name: values.name,
                        userRight: values.userRight,
                        nationalId: values.nationalId,
                        phoneNumber: values.phoneNumber,
                        email: values.userEmail
                    }
                ],
                address:[
                    {
                        street: values.street,
                        suburb: values.suburb,
                        city: values.city,

                }],
                accounts: [
                    {
                        accountType: "BUSINESS",
                    }
                ],
                username: values.username,
                password: values.password
            };

            try {
                const { data } = await loginAxiosClient.post('v1/corporate-customers', payload);

                if (data) {
                    showToast('Business created successfully. Visit your email for account activation', 'success');
                    resetForm();
                    await router.push('/login');
                }
            } catch (err: any) {
                showToast(err?.response?.data?.message || 'Registration failed', 'error');
            }
        }
    });

// Validate current step before allowing proceed
   /* const validateCurrentStep = async () => {
        const errors = await formik.validateForm();

        if (step === 1) {
            const step1Fields = [
                'companyName', 'email', 'address',
                'incorporationDate', 'registrationNumber', 'telephoneNumber',
                'numberOfRequiredApproversPerTransaction'
            ];
            const step1Errors = Object.keys(errors).filter(key => step1Fields.includes(key));
            if (step1Errors.length === 0) {
                setStep(2);
            }
        } else if (step === 2) {
            const step2Fields = [
                'name', 'userRight', 'nationalId',
                'phoneNumber', 'userEmail'
            ];
            const step2Errors = Object.keys(errors).filter(key => step2Fields.includes(key));
            if (step2Errors.length === 0) {
                setStep(3);
            }
        }
    };*/
    const validateCurrentStep = async () => {
        const errors = await formik.validateForm();

        if (step === 1) {
            const step1Fields = [
                'companyName', 'email', 'address',
                'incorporationDate', 'registrationNumber', 'telephoneNumber',
                'numberOfRequiredApproversPerTransaction', 'street', 'suburb', 'city'
            ];
            const step1Errors = Object.keys(errors).filter(key => step1Fields.includes(key));
            if (step1Errors.length === 0) {
                setStep(2);
            }
        } else if (step === 2) {
            const step2Fields = [
                'name', 'userRight', 'nationalId',
                'phoneNumber', 'userEmail'
            ];
            const step2Errors = Object.keys(errors).filter(key => step2Fields.includes(key));
            if (step2Errors.length === 0) {
                setStep(3);
            }
        }
        // Remove any submission logic from here
    };

// Only enable proceed if current step is valid
    useEffect(() => {
        const checkStepValidity = async () => {
            const errors = await formik.validateForm();

            if (step === 1) {
                const step1Fields = [
                    'companyName', 'email', 'address',
                    'incorporationDate', 'registrationNumber', 'telephoneNumber',
                    'numberOfRequiredApproversPerTransaction'
                ];
                const hasErrors = step1Fields.some(field => errors[field]);
                setCanProceed(!hasErrors);
            } else if (step === 2) {
                const step2Fields = [
                    'name', 'userRight', 'nationalId',
                    'phoneNumber', 'userEmail'
                ];
                const hasErrors = step2Fields.some(field => errors[field]);
                setCanProceed(!hasErrors);
            } else if (step === 3) {
                const step3Fields = ['username', 'password', 'confirmPassword'];
                const hasErrors = step3Fields.some(field => errors[field]);
                setCanProceed(!hasErrors);
            }
        };

        checkStepValidity();
    }, [formik.values, step]);

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        formik.setFieldValue('phoneNumber', value);
    };


    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <h1 className="text-3xl font-bold text-center">Business Registration</h1>
                    <p className="text-center text-blue-100 mt-2">
                        Complete all steps to register your business
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-6">
                    {/* Progress indicator */}
                    {/* Progress indicator - Beautiful Design */}
                    <div className="relative mb-10">
                        {/* Progress line with gradient */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -translate-y-1/2 z-10 transition-all duration-500 ease-in-out"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        <div className="flex justify-between relative z-20">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex flex-col items-center">
                                    {/* Step circle with gradient when active */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                                            step >= stepNumber
                                                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                                                : "bg-white border-4 border-gray-200 text-gray-400"
                                        }`}
                                    >
                                        {stepNumber}
                                    </div>

                                    {/* Step label */}
                                    <span
                                        className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                                            step >= stepNumber ? "text-cyan-400" : "text-gray-400"
                                        }`}
                                    >
          {stepNumber === 1 && "Business"}
                                        {stepNumber === 2 && "Contact"}
                                        {stepNumber === 3 && "Login"}
        </span>

                                    {/* Optional: Add checkmark for completed steps */}
                                    {step > stepNumber && (
                                        <div className="absolute top-3 text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                Enter Business Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaBuilding className="mr-2 text-cyan-400"/>
                                            Company Name*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaBuilding className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="companyName"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.companyName && formik.touched.companyName
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            placeholder="Company"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.companyName}
                                        />
                                    </div>
                                    {formik.errors.companyName && formik.touched.companyName && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.companyName}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaEnvelope className="mr-2 text-cyan-400"/>
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
                                            placeholder="email@gmail.com"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                    </div>
                                    {formik.errors.email && formik.touched.email && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-2 text-cyan-400"/>
                                            Incorporation Date*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCalendarAlt className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="incorporationDate"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.incorporationDate &&
                                                formik.touched.incorporationDate
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="date"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.incorporationDate}
                                            maxLength={12}
                                        />
                                    </div>
                                    {formik.errors.incorporationDate &&
                                        formik.touched.incorporationDate && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {formik.errors.incorporationDate}
                                            </div>
                                        )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaIdCard className="mr-2 text-cyan-400"/>
                                            Registration No*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaIdCard className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="registrationNumber"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.registrationNumber &&
                                                formik.touched.registrationNumber
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.registrationNumber}
                                        />
                                    </div>
                                    {formik.errors.registrationNumber &&
                                        formik.touched.registrationNumber && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {formik.errors.registrationNumber}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaUserShield className="mr-2 text-cyan-400"/>
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
                                            placeholder="0"
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
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaPhone className="mr-2 text-cyan-400"/>
                                            Telephone No*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="telephoneNumber"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.telephoneNumber && formik.touched.telephoneNumber
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="number"
                                            placeholder="0456345"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.telephoneNumber}
                                        />
                                    </div>
                                    {formik.errors.telephoneNumber && formik.touched.telephoneNumber && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.telephoneNumber}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                    Address Details
                                </h2>
                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <FaRoad className="mr-2 text-cyan-400"/>
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
                                                <div className="text-red-500 text-sm mt-1">
                                                    {formik.errors.street}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                <div className="flex items-center">
                                                    <FaLocationArrow className="mr-2 text-cyan-400"/>
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
                                                <div className="text-red-500 text-sm mt-1">
                                                    {formik.errors.suburb}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <FaMapLocation className="mr-2 text-cyan-400"/>
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
                                            <div className="text-red-500 text-sm mt-1">
                                                {formik.errors.city}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                Contact Person Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 text-cyan-400"/>
                                            Full Name*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="name"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.name && formik.touched.name
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="text"
                                            placeholder="John Doe"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                        />
                                    </div>
                                    {formik.errors.name && formik.touched.name && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaEnvelope className="mr-2 text-cyan-400"/>
                                            Email*
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400"/>
                                        </div>
                                        <input
                                            name="userEmail"
                                            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                formik.errors.userEmail && formik.touched.userEmail
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-300"
                                            }`}
                                            type="email"
                                            placeholder="email@gmail.com"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.userEmail}
                                        />
                                    </div>
                                    {formik.errors.userEmail && formik.touched.userEmail && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.userEmail}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaPhone className="mr-2 text-cyan-400"/>
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
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.phoneNumber}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        <div className="flex items-center">
                                            <FaIdCard className="mr-2 text-cyan-400"/>
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
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.nationalId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaIdCard className="mr-2 text-cyan-400"/>
                                        User Rights*
                                    </div>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400"/>
                                    </div>
                                    <select
                                        name="userRight"
                                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                                            formik.errors.userRight && formik.touched.userRight
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300"
                                        }`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.userRight}
                                    >
                                        <option value="">Choose...</option>
                                        <option value="INITIATOR">Initiator</option>
                                        <option value="AUTHORIZER">Authorizer</option>
                                        <option value="BOTH">Both</option>
                                    </select>
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FaChevronDown className="text-gray-400"/>
                                    </div>
                                </div>
                                {formik.errors.userRight && formik.touched.userRight && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.userRight}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                Create Login Credentials
                            </h2>
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaUserAlt className="mr-2 text-cyan-400"/>
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
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.username}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaLock className="mr-2 text-cyan-400"/>
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
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.password}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2 ml-1">
                                    Password must be at least 12 characters with uppercase, lowercase
                                    letters, number and a special character
                                </p>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <FaKey className="mr-2 text-cyan-400"/>
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
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.confirmPassword}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            disabled={step === 1 || formik.isSubmitting}
                            className={`py-3 px-8 rounded-lg font-medium transition-colors ${
                                step === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Previous
                        </button>

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={validateCurrentStep}
                                disabled={!canProceed || formik.isSubmitting}
                                className="py-3 px-8 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!canProceed || formik.isSubmitting}
                                className="py-3 px-8 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
    );
}