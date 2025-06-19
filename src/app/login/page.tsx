'use client';

import { setSessionData } from "@/shared/repositories/storage-repository";
import { showToast } from "@/shared/utilities/commons";
import { loginAuthUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";
import * as Yup from "yup";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";
import {useRouter} from "next/navigation";
import {ToastNotification} from "../notification";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useState} from "react";

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function Login() {

  const year = new Date().getFullYear();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'; show: boolean} | null>(null);

    // Helper function to show toast
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, show: true });
        setTimeout(() => setToast(null), 5000);
    };

    const loginForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

            setIsSubmitting(true);

            const payload =  {
                username: values.username,
                password: values.password,
            }

            try {

                const {data}  =  await loginAxiosClient.post(`v1/authenticate/customers`, payload);

                if (data.accessToken) {

                    await sessionStorage.setItem('token', data.accessToken);
                    await sessionStorage.setItem('customerId', data.customerId);
                    //await login(data.accessToken, data.customerId);
                    setIsSubmitting(false);
                    showToast('Login successfull', 'success');
                    setSessionData('atoken', data.accessToken);
                    setSessionData('display', data.name);
                    setSessionData('refe', data.customerId);
                    setSessionData('user', data.username);
                    setSessionData('role', data?.group?.name);
                    await router.push('/myspace');

                } else {
                    setIsSubmitting(false);
                    showToast("Login failed", 'error');
                }
            }catch(err:any){
                setIsSubmitting(false);
                showToast(err?.response?.data?.message, 'error');

            }
        },

        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: loginValidationSchema,
    });

  return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

          {/* Toast Notification */}
          {toast && (
              <ToastNotification
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
              />
          )}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col min-h-screen">
                  {/* Main Content */}
                  <div className="flex-grow flex items-center justify-center py-12">
                      <div className="w-full max-w-md">
                          {/* Logo Section */}
                          <div className="mx-auto mb-10 text-center">
                              <div className="flex items-center justify-center space-x-3">
                                  <div className=" relative">
                                      <Image
                                          width={190}
                                          height={90}
                                          src="/images/logo.svg"
                                          alt="Company Logo"
                                          className="m-2"
                                      />
                                  </div>
                              </div>
                          </div>

                          {/* Login Card */}
                          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100">
                              <div className="text-center mb-8">
                                  <h2 className="text-2xl font-bold text-gray-800">Administration</h2>
                                  <p className="mt-2 text-gray-500">Sign in to continue</p>
                              </div>

                              <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                                  {/* Username Field */}
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Username
                                      </label>
                                      <input
                                          name="username"
                                          className={`w-full px-4 py-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                              loginForm.errors.username && loginForm.touched.username
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                          }`}
                                          type="text"
                                          placeholder="Enter your username"
                                          required
                                          onChange={loginForm.handleChange}
                                          onBlur={loginForm.handleBlur}
                                          value={loginForm.values.username}
                                      />
                                      {loginForm.errors.username && loginForm.touched.username && (
                                          <p className="mt-2 text-sm text-red-600">
                                              {loginForm.errors.username}
                                          </p>
                                      )}
                                  </div>

                                  {/* Password Field */}
                                  <div>
                                      <div className="flex justify-between items-center mb-2">
                                          <label className="block text-sm font-medium text-gray-700">
                                              Password
                                          </label>
                                          <Link
                                              href="/password-reset"
                                              className="text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
                                          >
                                              Forgot password?
                                          </Link>
                                      </div>
                                      <input
                                          name="password"
                                          className={`w-full px-4 py-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                              loginForm.errors.password && loginForm.touched.password
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                          }`}
                                          type={showPassword ? "text" : "password"}
                                          placeholder="Enter your password"
                                          required
                                          onChange={loginForm.handleChange}
                                          onBlur={loginForm.handleBlur}
                                          value={loginForm.values.password}
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
                                      {loginForm.errors.password && loginForm.touched.password && (
                                          <p className="mt-2 text-sm text-red-600">
                                              {loginForm.errors.password}
                                          </p>
                                      )}
                                  </div>

                                  {/* Submit Button */}
                                  <div>
                                      <button
                                          className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-200 text-white font-medium rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                          disabled={loginForm.isSubmitting}
                                          type="submit"
                                      >
                                          {loginForm.isSubmitting ? (
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
                                              "Log In"
                                          )}
                                      </button>
                                  </div>
                              </form>

                              {/* Sign Up Link */}
                              <div className="mt-8 text-center">
                                  <p className="text-sm text-gray-500">
                                      Don't have an account?{" "}
                                      <Link
                                          href="/register"
                                          className="font-medium text-cyan-400 hover:text-cyan-400 transition-colors"
                                      >
                                          Create new
                                      </Link>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="py-6 text-center">
                      <p className="text-xs text-gray-500">
                          © {new Date().getFullYear()} IBanking. All rights reserved.
                      </p>
                  </div>
              </div>

              {/* Loading Overlay */}
              {isSubmitting && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-sm">
                          <div
                              className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                          <h3 className="text-lg font-medium text-black mb-2">Processing Verification</h3>
                          <p className="text-gray-600 text-center">Please wait while we verify your credentials
                              registration</p>
                      </div>
                  </div>
              )}
          </div>
      </section>
  );
}
