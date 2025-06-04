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
    FaLock, FaEye, FaEyeSlash, FaCalendarCheck, FaCalendarAlt, FaBuilding
} from 'react-icons/fa';
import {useRouter} from "next/navigation";


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
                address: values.address,
                incorporationDate: values.incorporationDate,
                registrationNumber: values.registrationNumber,
                telephoneNumber: values.telephoneNumber,
                numberOfRequiredApproversPerTransaction: values.numberOfRequiredApproversPerTransaction,
                userRight: [
                    {
                        name: values.name,
                        userRight: values.userRight,
                        nationalId: values.nationalId,
                        phoneNumber: values.phoneNumber,
                        email: values.userEmail
                    }
                ],
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
    const validateCurrentStep = async () => {
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

// ... (keep the same JSX return code)

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-8">Business Registration</h1>

            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                {/* Progress indicator */}
                <div className="flex mb-8">
                    <div className={`flex-1 border-t-4 pt-1 ${step >= 1 ? 'border-blue-600' : 'border-gray-300'}`}>
                        <p className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step 1: Business
                        </p>
                    </div>
                    <div className={`flex-1 border-t-4 pt-1 ${step >= 2 ? 'border-blue-600' : 'border-gray-300'}`}>
                        <p className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step 2: Contact
                        </p>
                    </div>
                    <div className={`flex-1 border-t-4 pt-1 ${step >= 3 ? 'border-blue-600' : 'border-gray-300'}`}>
                        <p className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step 3: Login
                        </p>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-center mb-8">Enter Business Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaBuilding className="mr-2"/> Company Name*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBuilding className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="companyName"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.companyName && formik.touched.companyName
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="text" placeholder="Company"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.companyName}
                                    />
                                </div>
                                {formik.errors.companyName && formik.touched.companyName && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.companyName}</div>
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
                                        type="email" placeholder="email@gmail.com"
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
                                    <FaCalendarAlt className="mr-2"/> Incorporation Date*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="incorporationDate"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.incorporationDate && formik.touched.incorporationDate
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="date"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.incorporationDate}
                                        maxLength={12}
                                    />
                                </div>
                                {formik.errors.incorporationDate && formik.touched.incorporationDate && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.incorporationDate}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700 flex items-center">
                                    <FaIdCard className="mr-2"/> Registration No*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="registrationNumber"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.registrationNumber && formik.touched.registrationNumber
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.registrationNumber}
                                    />
                                </div>
                                {formik.errors.registrationNumber && formik.touched.registrationNumber && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.registrationNumber}</div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        type="number" placeholder="0"
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
                                    <FaPhone className="mr-2"/> Telephone No*
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="text-gray-400"/>
                                    </div>
                                    <input
                                        name="telephoneNumber"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.telephoneNumber &&
                                            formik.touched.telephoneNumber
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="number" placeholder="0456345"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.telephoneNumber}
                                    />
                                </div>
                                {formik.errors.telephoneNumber &&
                                    formik.touched.telephoneNumber && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.telephoneNumber}
                                        </div>
                                    )}
                            </div>
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
                                    type="text" placeholder="123 Street"
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

                        <h1 className="text-xl font-bold text-center mb-8">Contact Person Details</h1>
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
                                        name="name"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.name && formik.touched.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="text" placeholder="John Doe"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                    />
                                </div>
                                {formik.errors.name && formik.touched.name && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
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
                                        name="userEmail"
                                        className={`w-full pl-10 p-2 border rounded-md ${
                                            formik.errors.userEmail && formik.touched.userEmail
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        type="email" placeholder="email@gmail.com"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.userEmail}
                                    />
                                </div>
                                {formik.errors.userEmail && formik.touched.userEmail && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.userEmail}</div>
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
                                <FaIdCard className="mr-2"/>User Rights*
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaIdCard className="text-gray-400"/>
                                </div>
                                <select
                                    name="userRight"
                                    className={`w-full pl-10 p-2 border rounded-md ${
                                        formik.errors.userRight && formik.touched.userRight
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userRight}>
                                    <option value="">Choose...</option>
                                    <option value="INITIATOR">Initiator</option>
                                    <option value="AUTHORIZER">Authorizer</option>
                                    <option value="BOTH">Both</option>
                                </select>
                            </div>
                            {formik.errors.userRight && formik.touched.userRight && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.userRight}</div>
                            )}
                        </div>
                    </div>
                )}
                {step === 3 && (
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
                                    className={`w-full pl-10 pr-10 p-2 border rounded-md ${
                                        formik.errors.password && formik.touched.password
                                            ? "border-red-500"
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
                                    {showPassword ? <FaEyeSlash className="text-gray-400"/> :
                                        <FaEye className="text-gray-400"/>}
                                </div>
                            </div>
                            {formik.errors.password && formik.touched.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                            <p className="text-xs text-gray-500 mt-1 ml-2">
                                Password must be at least 12 characters with uppercase, lowercase letters, number and a
                                special character
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
                                    className={`w-full pl-10 pr-10 p-2 border rounded-md ${
                                        formik.errors.confirmPassword && formik.touched.confirmPassword
                                            ? "border-red-500"
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
                                    {showConfirmPassword ? <FaEyeSlash className="text-gray-400"/> :
                                        <FaEye className="text-gray-400"/>}
                                </div>
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
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}
                    >
                        Previous
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={validateCurrentStep}
                            disabled={!canProceed || formik.isSubmitting}
                            className="py-2 px-6 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!canProceed || formik.isSubmitting}
                            className="py-2 px-6 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? 'Processing...' : 'Submit'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}