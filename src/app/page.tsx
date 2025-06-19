'use client';

import {setSessionData} from "@/shared/repositories/storage-repository";
import {showToast} from "@/shared/utilities/commons";
import Image from "next/image";
import Link from "next/link";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";
import * as Yup from "yup";
import {useRouter} from "next/navigation";

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function Login() {

    const year = new Date().getFullYear();
    const router = useRouter();

    const loginForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

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
                    showToast('Login successfull', 'success');
                    setSessionData('atoken', data.accessToken);
                    setSessionData('display', data.name);
                    setSessionData('refe', data.customerId);
                    setSessionData('user', data.username);
                    setSessionData('role', data?.group?.name);
                    await router.push('/myspace');

                } else {
                    showToast("Login failed", 'error');
                }
            }catch(err:any){
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col min-h-screen">
                  {/* Main Content */}
                  <div className="flex-grow flex items-center justify-center py-12">
                      <div className="w-full max-w-md">
                          {/* Logo Section */}
                          <div className="mx-auto mb-10 text-center">
                              <div className="flex items-center justify-center space-x-3">
                                  <div className="w-90 h-70 relative">
                                      <Image
                                          width={140}
                                          height={90}
                                          src="/images/logo.svg"
                                          alt="Company Logo"
                                          className="object-contain"
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
                                          type="password"
                                          placeholder="Enter your password"
                                          required
                                          onChange={loginForm.handleChange}
                                          onBlur={loginForm.handleBlur}
                                          value={loginForm.values.password}
                                      />
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
          </div>
      </section>

  );
}
