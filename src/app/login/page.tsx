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

                const {data}  =  await loginAxiosClient.post(`v1/authenticate`, payload);

                if (data != null) {
                    showToast('Customer created successfully.visit your email for account activation', 'success');
                    //await router.push('/login');

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
    <section className="group">
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
                                    <h5 className="font-medium text-gray-700">Administration</h5>
                                    <p className="mt-2 mb-4 text-gray-500">Sign in to continue.</p>
                                </div>

                                <form className="pt-2" onSubmit={loginForm.handleSubmit} action="#">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Username</label>
                                        <input name="username"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   loginForm.errors.username && loginForm.touched.username
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="username" placeholder="Username" required
                                               onChange={loginForm.handleChange}
                                               onBlur={loginForm.handleBlur}
                                               value={loginForm.values.username}/>
                                        {loginForm.errors.username && loginForm.touched.username && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{loginForm.errors.username}</div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                                        <input name="password"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   loginForm.errors.password && loginForm.touched.password
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="password" id="password" placeholder="Password" required
                                               onChange={loginForm.handleChange}
                                               onBlur={loginForm.handleBlur}
                                               value={loginForm.values.password}/>
                                        {loginForm.errors.password && loginForm.touched.password && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{loginForm.errors.password}</div>
                                        )}
                                    </div>
                                    <div className="mb-6 row">

                                    </div>
                                    <div className="mb-3">
                                        <button className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600"  disabled={loginForm.isSubmitting}
                                                type="submit">{loginForm.isSubmitting ? "Processing..." : "Log In"}</button>
                                    </div>
                                </form>

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

    </section>
  );
}
