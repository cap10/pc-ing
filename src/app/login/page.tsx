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

                if (data.accessToken != null) {

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
      <section className="min-h-screen bg-white">
          <div className="container mx-auto px-4">
              <div className="flex flex-col min-h-screen">
                  <div className="flex-grow flex items-center justify-center py-8">
                      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                          <div className="mx-auto">
                              <a href="#" className="">
                                  <Image width={828} height={315} src="/images/logo.svg" alt="" className=""/> <span
                                  className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                              </a>
                          </div>

                          <div className="bg-white rounded-lg shadow-sm p-6">
                              <div className="text-center mb-6">
                                  <h5 className="font-medium text-gray-700">Administration</h5>
                                  <p className="mt-2 text-gray-500">Sign in to continue.</p>
                              </div>

                              <form onSubmit={loginForm.handleSubmit}>
                                  <div className="mb-4">
                                      <label className="block mb-2 font-medium text-gray-700">Username</label>
                                      <input
                                          name="username"
                                          className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                              loginForm.errors.username && loginForm.touched.username
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                          }`}
                                          type="text"
                                          placeholder="Username"
                                          required
                                          onChange={loginForm.handleChange}
                                          onBlur={loginForm.handleBlur}
                                          value={loginForm.values.username}
                                      />
                                      {loginForm.errors.username && loginForm.touched.username && (
                                          <div className="text-red-500 text-sm mt-1">
                                              {loginForm.errors.username}
                                          </div>
                                      )}
                                  </div>

                                  <div className="mb-4">
                                      <label className="block mb-2 font-medium text-gray-600">Password</label>

                                          <div className="mb-1 flex-auto text-right">
                                              <Link href="/password-reset" className="text-color-secondary font-bold">Forgot
                                                  password?</Link>
                                          </div>
                                      <input
                                          name="password"
                                          className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                              loginForm.errors.password && loginForm.touched.password
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                          }`}
                                          type="password"
                                          placeholder="Password"
                                          required
                                          onChange={loginForm.handleChange}
                                          onBlur={loginForm.handleBlur}
                                          value={loginForm.values.password}
                                      />
                                      {loginForm.errors.password && loginForm.touched.password && (
                                          <div className="text-red-500 text-sm mt-1">
                                              {loginForm.errors.password}
                                          </div>
                                      )}
                                  </div>

                                  <div className="mb-6">

                                      <div className="mb-3">
                                          <button
                                              className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600"
                                                  disabled={loginForm.isSubmitting}
                                                  type="submit">{loginForm.isSubmitting ? "Processing..." : "Log In"}
                                          </button>
                                      </div>
                                  </div>
                              </form>

                              <div className="text-center mt-4">
                                  <p className="text-gray-500">
                                      Don't have an account?{" "}
                                      <Link href="/register"
                                            className="text-color-secondary font-bold">
                                          Create new
                                      </Link>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="py-2 text-center">
                      <p className="text-gray-500">
                          © {new Date().getFullYear()} IBanking.
                      </p>
                  </div>
              </div>
          </div>
      </section>
  );
}
