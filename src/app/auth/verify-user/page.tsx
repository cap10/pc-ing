'use client';

import { showToast } from "@/shared/utilities/commons";
import { forgotPwdUtil, setPwdUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";
import { useState } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";

export default function VerifyUser() {

    const searchParams = useSearchParams();
    const token = searchParams.get('otp');
    const username = searchParams.get('username');
    const router = useRouter();
    const year = new Date().getFullYear();

    const SetPasswordForm = useFormik({
        async onSubmit<Values>(values: any, { resetForm, setErrors }: any) {

            const  payload = {
                token:token
            }
            try {
                const { data } = await loginAxiosClient.post('v1/users/verify', payload);
                if (data != null ) {
                    showToast('User Account verified', 'success');
                    await router.push('/login');
                }
            } catch (err:any) {
                if (err.response.status === 400 || err.response.status === 401) {
                    showToast('User verification failed.', 'error');
                } else {
                    showToast('User verification failed.', 'error');
                }
            }
        },

        initialValues: {
            password: '',
            confirmPassword: '',
        },
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
                                        <Image width={828} height={315} src="/images/logo.svg" alt="" className=""/>
                                        <span
                                            className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                                    </a>
                                </div>

                                <div className="mb-3">
                                    <div className="text-center">
                                        <h5 className="font-medium text-gray-700">User Account verification </h5>
                                        <p className="mt-2 mb-4 text-gray-500">Verify your account</p>
                                    </div>

                                    <form className="pt-2" onSubmit={SetPasswordForm.handleSubmit} action="#">


                                        <p className="text-md  text-center mt-6 mb-3">Confirm your username!</p>
                                        <h1 className="text-xl font-bold text-center mb-8">{username}</h1>

                                        <div className="mb-3">
                                            <button
                                                className="w-full py-2 text-white bg-blue-600 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
                                                disabled={SetPasswordForm.isSubmitting}
                                                type="submit"
                                            >
                                                {SetPasswordForm.isSubmitting ? "Processing..." : "Verify Account"}
                                            </button>
                                        </div>
                                    </form>

                                    {/*
                                    <form className="pt-2" onSubmit={SetPasswordForm.handleSubmit} action="#">
                                        <div className="mb-4">
                                            <FormControl
                                                isInvalid={Boolean(SetPasswordForm.errors.password) && SetPasswordForm.touched.password}>
                                            <label className="block mb-2 font-medium text-gray-700">Password</label>
                                            <input id="password" name="password" type="password"
                                                   className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal"
                                                   placeholder="Enter password" aria-label="Password"
                                                   aria-describedby="password-addon"
                                                   onChange={SetPasswordForm.handleChange}
                                                   value={SetPasswordForm.values.password}/>
                                                <FormErrorMessage><>{SetPasswordForm.errors.password}</>
                                                </FormErrorMessage>
                                            </FormControl>
                                        </div>
                                        <div className="mb-4">
                                            <FormControl
                                                isInvalid={Boolean(SetPasswordForm.errors.confirmPassword) && SetPasswordForm.touched.confirmPassword}>
                                            <label className="block mb-2 font-medium text-gray-700">Confirm
                                                Password</label>
                                            <input type="password"  id="confirmPassword"  aria-label="Password" aria-describedby="confirm-password"
                                                   className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal"
                                                   placeholder="Confirm password"
                                                   onChange={SetPasswordForm.handleChange}
                                                   value={SetPasswordForm.values.confirmPassword}
                                            />
                                                <FormErrorMessage><>{SetPasswordForm.errors.confirmPassword}</>
                                                </FormErrorMessage>
                                            </FormControl>
                                        </div>
                                        <div className="mb-6 row">


                                        </div>
                                        <div className="mb-3">
                                            <button className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600"
                                                    isLoading={SetPasswordForm.isSubmitting}
                                                    type="submit">Set Password
                                            </button>
                                        </div>
                                    </form>
*/}

                                    <div className="pt-2 mt-5 text-center">
                                        <div>
                                        </div>

                                        <div className="flex justify-center gap-3">
                                        </div>
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

        </section>
    );
}