'use client';

import { setSessionData } from "@/shared/repositories/storage-repository";
import { showToast } from "@/shared/utilities/commons";
import { loginAuthUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";
import * as Yup from "yup";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/auth";

const loginValidationSchema = Yup.object({
    username: Yup.string().required('username required'),
    password: Yup.string().required('password required'),
});

export default function Login() {
    const { authenticate } = useAuth();
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

console.log("Tokemn=", data.accessToken);
console.log("CustomerID", data.customerId)
                    await localStorage.setItem('token', data.accessToken);
                    await localStorage.setItem('organisationId', data.customerId);
                    showToast('Login successfull', 'success');
                    //await authenticate(data?.accessToken);
                    await setSessionData('atoken', data?.accessToken);
                    await setSessionData('display', data.name);
                    await setSessionData('refe', data.customerId);
                    await setSessionData('user', data.username);
                    await setSessionData('role', data?.group?.name);
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
      /*<section className="group">
          <div className="container-fluid">
              <div className="h-screen md:overflow-hidden">
                  <div className="relative z-50 col-span-12">
                      <div className="w-full bg-white md:p-12 place-content-center">
                          <div className="flex h-[100vh] flex-col w-80 lg:w-96 m-auto">
                              <div className="mx-auto">
                                  <a href="#" className="">
                                      <Image width={828} height={315} src="/images/logo.svg" alt="" className="" /> <span className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                                  </a>
                              </div>

                              <div className="mb-3">
                                  <div className="text-center">
                                      <h5 className="font-medium text-gray-700">Welcome Back.!</h5>
                                      <p className="mt-2 mb-4 text-gray-500">Sign in to continue.</p>
                                  </div>

                                  <form className="pt-2" action="#">
                                      <div className="mb-4">
                                          <label className="block mb-2 font-medium text-gray-700">Username</label>
                                          <input type="text" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" id="username" placeholder="Enter username" />
                                      </div>
                                      <div className="mb-3">
                                          <div className="flex">
                                              <div className="flex-auto">
                                                  <label className="block mb-2 font-medium text-gray-600">Password</label>
                                              </div>
                                              <div className="flex-auto text-right">
                                                  <Link href="/password-reset" className="text-color-secondary font-bold">Forgot password?</Link>
                                              </div>
                                          </div>

                                          <div className="flex">
                                              <input id="password" type="password" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" placeholder="Enter password" aria-label="Password" aria-describedby="password-addon" />
                                          </div>
                                      </div>
                                      <div className="mb-6 row">


                                      </div>
                                      <div className="mb-3">
                                          <button onClick={login} className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600" type="button">Log In</button>
                                      </div>
                                  </form>

                                  <div className="pt-2 mt-5 text-center">
                                      <div>
                                      </div>

                                      <div className="flex justify-center gap-3">
                                      </div>
                                  </div>

                                  <div className="mt-3 text-center">
                                      <p className="text-gray-500">Don`t have an account? <Link href="/register" className="font-semibold text-color-secondary"> Create new</Link>. </p>
                                  </div>

                                  <div className="mt-12 text-center" id="adminRoute" style={{display: 'none'}}>
                                      <p className="text-gray-500">For Admin Portal <Link href="/login" className="font-semibold text-color-secondary"> click here </Link>. </p>
                                  </div>
                              </div>


                              <div className="text-center mt-8">
                                  <p className="relative text-gray-500">
                                    © {year} IBanking.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </section>*/
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
