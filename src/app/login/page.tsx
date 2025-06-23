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
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {XCircleIcon} from "@heroicons/react/16/solid";

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function Login() {

  const year = new Date().getFullYear();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);

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
                    setFailureOpen(true);

                }
            }catch(err:any){
                setIsSubmitting(false);
                setFailureOpen(true);

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
                                      Login Failed
                                  </DialogTitle>

                                  <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full mb-4"></div>

                                  <div className="space-y-3 mb-6">
                                      <p className="text-sm sm:text-base text-red-700 font-medium">
                                          Incorrect credentials provided.
                                      </p>

                                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
                                          <div className="space-y-2 text-sm">
                                              <div className="flex justify-between">
                                                  <span className="text-gray-600">Error Code:</span>
                                                  <span className="font-semibold text-red-700">#ERR_401</span>
                                              </div>
                                              <div className="flex justify-between">
                                                  <span className="text-gray-600">Reason:</span>
                                                  <span className="font-semibold text-red-700">Incorrect credentials</span>
                                              </div>
                                              <div className="flex justify-between">
                                                  <span className="text-gray-600">Status:</span>
                                                  <span className="font-semibold text-red-700">Failed</span>
                                              </div>
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
                                      className="w-80 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
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
                  <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                      <div className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-white/30 relative overflow-hidden">

                          {/* Animated background gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 animate-pulse"></div>

                          {/* Enhanced spinner with multiple rings */}
                          <div className="relative mb-6">
                              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-transparent border-t-cyan-500 border-r-cyan-400"></div>
                              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-300" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                              <div className="absolute inset-4 animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
                          </div>

                          {/* Enhanced text with subtle animations */}
                          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 text-center">
                              Verifying your credentials
                              <span className="inline-block animate-pulse">...</span>
                          </h3>

                          <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4">
                              Please wait while we securely verify your credentials
                          </p>

                          {/* Progress indicator */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-pulse" style={{width: '70%'}}></div>
                          </div>

                          {/* Status text */}
                          <p className="text-xs text-gray-500 text-center animate-pulse">
                              Verifying login credentials...
                          </p>

                          {/* Decorative elements */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      </div>
                  </div>
              )}
          </div>
      </section>

  );
}
