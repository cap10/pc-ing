'use client';

import { showToast } from "@/shared/utilities/commons";
import { forgotPwdUtil, setPwdUtil } from "@/shared/utilities/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {request} from "node:http";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginAxiosClient} from "@/endpoints/loginApi";

const validationSchema = Yup.object({
    password: Yup.string()
        .required('Password required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number'),
    confirmPassword: Yup.string()
        .required('Please confirm password')
        .oneOf([Yup.ref('password')] as const, 'Passwords do not match'),
});

export default function ForgotPassword() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const year = new Date().getFullYear();

    const SetPasswordForm = useFormik({
        async onSubmit<Values>(values: any, { resetForm, setErrors }: any) {

            const  payload = {
                token:token,
                password:values.password,
                confirmPassword:values.confirmPassword,
            }
            try {
                const { data } = await loginAxiosClient.post('v1/users/reset-password', payload);
                if (data != null ) {
                    showToast('Password changed successfully.', 'success');
                    await router.push('/login');
                }
            } catch (err:any) {
                    if (err.response.status === 400 || err.response.status === 401) {
                        showToast('Password set failed.', 'error');
                    } else {
                        showToast('Password set failed.', 'error');
                    }
            }
        },

        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
    });

    const fgtPwd = () => {
        const uname = document.getElementById('username');

        if(!uname?.value){
            showToast('Username Required.', 'error');

            uname?.classList.remove('border-gray-300');
            uname?.classList.add('border-red-400');

            return;
        }
        else{
            uname?.classList.remove('border-red-400');

            uname?.classList.add('border-gray-300');
        }

        // console.log(uname);

        forgotPwdUtil(uname.value)
            .then(resp => {
                console.log(resp);

                if(resp?.message){
                    showToast(resp.message, 'error');
                    return;
                }

                showToast('Password Reset request initiated.', 'success');
                uname.value = '';
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to request Password Reset.', 'error');
            })



    }

    const setPwd = () => {
        const pwd = document.getElementById('password');
        const pwd2 = document.getElementById('password2');


        if(!pwd?.value || !pwd2?.value){
            showToast('Passwords Required.', 'error');

            pwd?.classList.remove('border-gray-300');
            pwd?.classList.add('border-red-400');

            pwd2?.classList.remove('border-gray-300');
            pwd2?.classList.add('border-red-400');

            return;
        }
        else{
            pwd?.classList.remove('border-red-400');
            pwd2?.classList.remove('border-red-400');

            pwd?.classList.add('border-gray-300');
            pwd2?.classList.add('border-gray-300');
        }

        // console.log(uname);

        if(pwd?.value != pwd2?.value){
            showToast('Passwords do not match.', 'error');

            pwd2?.classList.remove('border-gray-300');
            pwd2?.classList.add('border-red-400');

            return;
        }
        else{
            pwd2?.classList.add('border-gray-300');
            pwd2?.classList.remove('border-red-400');
        }

        setPwdUtil(token, pwd?.value, pwd2?.value)
            .then(resp => {
                console.log(resp);

                if(resp?.message){
                    showToast(resp.message, 'error');
                    return;
                }

                showToast('Password updated successfully.', 'success');
                document.location.href = '/';
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to set Password.', 'error');
            })



    }

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
                                        <h5 className="font-medium text-gray-700">Set new Password</h5>
                                        <p className="mt-2 mb-4 text-gray-500">Create your own desired password.</p>
                                    </div>

                                    <form className="pt-2" onSubmit={SetPasswordForm.handleSubmit} action="#">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-700">Password</label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                className={`w-full py-1.5 border rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal ${
                                                    SetPasswordForm.errors.password && SetPasswordForm.touched.password
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Enter password"
                                                onChange={SetPasswordForm.handleChange}
                                                onBlur={SetPasswordForm.handleBlur}
                                                value={SetPasswordForm.values.password}
                                            />
                                            {SetPasswordForm.errors.password && SetPasswordForm.touched.password && (
                                                <div className="text-red-500 text-sm mt-1">{SetPasswordForm.errors.password}</div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-700">Confirm
                                                Password</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className={`w-full py-1.5 border rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal ${
                                                    SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Confirm password"
                                                onChange={SetPasswordForm.handleChange}
                                                onBlur={SetPasswordForm.handleBlur}
                                                value={SetPasswordForm.values.confirmPassword}
                                            />
                                            {SetPasswordForm.errors.confirmPassword && SetPasswordForm.touched.confirmPassword && (
                                                <div  className="text-red-500 text-sm mt-1">{SetPasswordForm.errors.confirmPassword}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <button
                                                className="w-full py-2 text-white bg-blue-600 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
                                                disabled={SetPasswordForm.isSubmitting}
                                                type="submit"
                                            >
                                                {SetPasswordForm.isSubmitting ? "Processing..." : "Set Password"}
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
