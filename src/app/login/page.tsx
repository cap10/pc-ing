'use client';

import { setSessionData } from "@/shared/repositories/storage-repository";
import { showToast } from "@/shared/utilities/commons";
import { loginAuthUtil } from "@/shared/utilities/utils";
import Image from "next/image"; 
import Link from "next/link";

export default function Login() {
  const year = new Date().getFullYear();

  const login = () => {
    const uname = document.getElementById('username');
    const upwd = document.getElementById('password');

    if(!uname?.value || !upwd?.value){
        showToast('Username and Password Required.', 'error');

        uname?.classList.remove('border-gray-300');
        uname?.classList.add('border-red-400');

        upwd?.classList.remove('border-gray-300');
        upwd?.classList.add('border-red-400');

        return;
    }
    else{
        uname?.classList.remove('border-red-400');
        upwd?.classList.remove('border-red-400');

        uname?.classList.add('border-gray-300');
        upwd?.classList.add('border-gray-300');
    }

    // console.log(uname);

    loginAuthUtil(uname.value, upwd.value, 'admin')
    .then(resp => {
        // console.log(resp);
        
        if(resp.status == 403){
            showToast(resp.message, 'error');
            return;
        }

        if(resp.accessToken && !resp.customerId){
            setSessionData('atoken', resp.accessToken);
            setSessionData('display', resp.name);
            setSessionData('user', resp.username);
            setSessionData('role', resp?.group?.name);

            document.location.href = '/dashboard';
        }
    })
    .catch(err => {
        console.log(err);
        showToast('Failed to Login.', 'error');
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

                            <div className="mb-3">
                                <div className="text-center">
                                    <h5 className="font-medium text-gray-700">Administration</h5>
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
