'use client';

import { showToast } from "@/shared/utilities/commons";
import { forgotPwdUtil, setPwdUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";
import { useState } from "react";

export default function VerifyUser({searchParams} : {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    
    const year = new Date().getFullYear();
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');

    (searchParams).then(r=> {
        // console.log(r.token);
        if(r.otp) setToken(r.otp.toString());
        if(r.username) setUsername(r.username.toString());
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

                            {token && username ? (
                                    <div className="mb-3">
                                        <div className="text-center">
                                            <h5 className="font-medium text-gray-700">User Verification</h5>
                                            <p className="mt-2 mb-4 text-gray-500">Welcome <span className="font-bold">{username}</span>.</p>
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
                                                <button className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600" type="button">Set Password</button>
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
                                            <h5 className="font-medium text-gray-700">User Verification</h5>
                                            <p className="mt-2 mb-4 text-gray-500">Invalid request.</p>
                                        </div>

                                        <form className="pt-2" action="#">
                                            <div className="mb-4">
                                                <div className="flex p-4 text-sm text-red-700 rounded bg-red-50 " role="alert">
                                                    <i className="fa-solid fa-circle-stop m-1"></i>
                                                    <div>
                                                        <span className="font-semibold">Invalid Request</span>
                                                        <p className="mt-1">The provided verification is either wrong, invalid or missing. Kindly try again or click below for the login page.</p>
                                                        <div className="flex gap-3 mt-4">
                                                            <Link href="/" type="button" className="font-semibold border border-red-700 rounded-md p-2 btn hover:bg-red-700 hover:text-white">
                                                                Login Page
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="pt-2 mt-5 text-center">
                                            <div>
                                            </div>

                                            <div className="flex justify-center gap-3">
                                            </div>
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
