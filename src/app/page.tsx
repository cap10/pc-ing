'use client';

import {setSessionData} from "@/shared/repositories/storage-repository";
import {showToast} from "@/shared/utilities/commons";
import Image from "next/image";
import Link from "next/link";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {ToastNotification} from "./notification";

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
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
              <div
                  className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
              <div
                  className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"></div>
          </div>

          {/* Toast Notification */}
          {toast && (
              <ToastNotification
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
              />
          )}

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col min-h-screen">
                  {/* Main Content */}
                  <div className="flex-grow flex items-center justify-center py-8 sm:py-12">
                      <div className="w-full max-w-md lg:max-w-lg">
                          {/* Logo Section */}
                          <div className="mx-auto mb-8 sm:mb-12 text-center">
                              <div className="flex items-center justify-center space-x-3">
                                  <div className="relative">
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
                          <div
                              className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
                              <div className="text-center mb-6 sm:mb-8">
                                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Administration</h2>
                                  <p className="mt-2 text-gray-500 text-sm sm:text-base">Sign in to continue</p>
                                  <div
                                      className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                              </div>

                              <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                                  {/* Username Field */}
                                  <div>
                                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                          <div className="flex items-center">
                                              <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                   stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                              </svg>
                                              Username
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
                                              name="username"
                                              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
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
                                      </div>
                                      {loginForm.errors.username && loginForm.touched.username && (
                                          <p className="mt-2 text-sm text-red-600">
                                              {loginForm.errors.username}
                                          </p>
                                      )}
                                  </div>

                                  {/* Password Field */}
                                  <div className="relative">
                                      <div className="flex justify-between items-center mb-2">
                                          <label className="block text-sm sm:text-base font-medium text-gray-700">
                                              <div className="flex items-center">
                                                  <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none"
                                                       stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                  </svg>
                                                  Password
                                              </div>
                                          </label>
                                          <Link
                                              href="/password-reset"
                                              className="text-xs sm:text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
                                          >
                                              Forgot password?
                                          </Link>
                                      </div>
                                      <div className="relative group">
                                          <div
                                              className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                              <svg
                                                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors"
                                                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                              </svg>
                                          </div>
                                          <input
                                              name="password"
                                              className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform focus:scale-[1.02] focus:shadow-lg ${
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
                                          <button
                                              type="button"
                                              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                                              onClick={() => setShowPassword(!showPassword)}
                                          >
                                              {showPassword ? (
                                                  <FaEyeSlash
                                                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                              ) : (
                                                  <FaEye
                                                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"/>
                                              )}
                                          </button>
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
                                          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
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
                              <div className="mt-6 sm:mt-8 text-center">
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
                  <div className="py-4 sm:py-6 text-center">
                      <p className="text-xs sm:text-sm text-gray-500">
                          © {new Date().getFullYear()} IBanking. All rights reserved.
                      </p>
                  </div>
              </div>

              {/* Loading Overlay */}
              {isSubmitting && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-sm">
                          <div
                              className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-cyan-600 mb-4"></div>
                          <h3 className="text-base sm:text-lg font-medium text-black mb-2">Processing Verification</h3>
                          <p className="text-sm sm:text-base text-gray-600 text-center">Please wait while we verify your
                              credentials registration</p>
                      </div>
                  </div>
              )}
          </div>
      </section>
  );
}
