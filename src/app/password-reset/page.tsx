'use client';

import { showToast } from "@/shared/utilities/commons";
import { forgotPwdUtil, setPwdUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";
import { useState } from "react";

export default function PasswordReset({searchParams} : {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    
    const year = new Date().getFullYear();
    const [token, setToken] = useState('');

    (searchParams).then(r=> {
        // console.log(r.token);
        if(r.token) setToken(r.token.toString());
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
                                    <Image width={828} height={315} src="/images/logo.svg" alt="" className="" /> <span className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                                </a>
                            </div>

                            {token ? (
                                    <div className="mb-3">
                                        <div className="text-center">
                                            <h5 className="font-medium text-gray-700">Password Reset</h5>
                                            <p className="mt-2 mb-4 text-gray-500">Enter desired password.</p>
                                        </div>
        
                                        <form className="pt-2" action="#">
                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium text-gray-700">Password</label>
                                                <input id="password" type="password" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" placeholder="Enter password" aria-label="Password" aria-describedby="password-addon" />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
                                                <input id="password2" type="password" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" placeholder="Confirm password" aria-label="Password" aria-describedby="password-addon" />
                                            </div>
                                            <div className="mb-6 row">
                                            
        
                                            </div>
                                            <div className="mb-3">
                                                <button onClick={setPwd} className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600" type="button">Reset Password</button>
                                            </div>
                                        </form>
        
                                        <div className="pt-2 mt-5 text-center">
                                            <div>
                                            </div>
        
                                            <div className="flex justify-center gap-3">
                                            </div>
                                        </div>
        
                                    </div>
                                ) : 
                                (
                                    <div className="mb-3">
                                        <div className="text-center">
                                            <h5 className="font-medium text-gray-700">Password Reset</h5>
                                            <p className="mt-2 mb-4 text-gray-500">Enter username to continue.</p>
                                        </div>

                                        <form className="pt-2" action="#">
                                            <div className="mb-4">
                                                <label className="block mb-2 font-medium text-gray-700">Username</label>
                                                <input type="text" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" id="username" placeholder="Enter username" />
                                            </div>
                                            <div className="mb-6 row">
                                            

                                            </div>
                                            <div className="mb-3">
                                                <button onClick={fgtPwd} className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600" type="button">Reset Password</button>
                                            </div>
                                        </form>

                                        <div className="pt-2 mt-5 text-center">
                                            <div>
                                            </div>

                                            <div className="flex justify-center gap-3">
                                            </div>
                                        </div>

                                        <div className="mt-12 text-center">
                                            <p className="text-gray-500">Remember password ? <Link href="/" className="font-semibold text-color-secondary"> Login now </Link> </p>
                                        </div>
                                    </div>
                                )
                            }


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
