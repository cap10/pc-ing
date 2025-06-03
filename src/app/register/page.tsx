'use client';

import { showToast } from "@/shared/utilities/commons";
import Image from "next/image"; 
import { useEffect } from "react";
import IndividualSelfRegister from "@/shared/ui/individualSelfReg";
import CorporateSelfRegister from "@/shared/ui/corporateSelfReg";
import AgentSelfRegister from "@/shared/ui/agentSelfReg";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: 'Configs',
// };

export default function Register() {
    const year = new Date().getFullYear();

    function loadAccType(){
        const typ = document.getElementById('accType');
        const btnArea = document.getElementById('btnArea');
        const indiArea = document.getElementById('individualArea');
        const corpoArea = document.getElementById('corporateArea');
        const agentArea = document.getElementById('agentArea');

        if(typ?.value){

            // console.log(typ.value, typ.value == 'CORPORATE');

            if(typ.value == 'BUSINESS'){
                if(corpoArea) corpoArea.style.display = 'block';
            }
            else if(typ.value == 'AGENT'){
                if(agentArea.style.display == 'block');            }

            else if(typ.value == 'CUSTOMER')
                if(indiArea) indiArea.style.display = 'block';
            else showToast('Unrecognized customer type', 'warn');

            if(btnArea) btnArea.style.display = 'none';
            
        }
        else{
            showToast('Pick an account type to proceed', 'info');
        }
    }

    useEffect(() => {
        
    }, [])

    return (
        <section className="group">
        <div className="container-fluid">
            <div className="h-screen">
                <div className="relative z-50 col-span-12">
                    <div className="w-full bg-white md:p-12 place-content-center">
                        <div className="flex h-[100vh] flex-col w-8/12 lg:w-8/12 m-auto">
                            <div className="mx-auto">
                                <a href="#" className="">
                                    <Image width={828} height={315} src="/images/logo.svg" alt="" className="" /> <span className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                                </a>
                            </div>

                            <div className="mb-3">
                                <div className="text-center">
                                    <h5 className="font-medium text-gray-700">Account Signup </h5>
                                    <p className="mt-2 mb-4 text-gray-500">Customer Self-registration.</p>
                                </div>

                                <main className="pt-2">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Choose Account Type</label>
                                        <select className="w-full disabled:text-gray-600 border rounded border-gray-200 p-2" id="accType" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="BUSINESS">Business</option>
                                            <option value="AGENT">Agent</option>
                                        </select>
                                    </div>
                                    <div className="mb-3" id="btnArea">
                                        <button onClick={loadAccType} className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-secondary rounded-md font-bold hover:bg-blue-600" type="button">
                                            Proceeed <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                    <div className="mb-3 hidden" id="individualArea">
                                        <IndividualSelfRegister></IndividualSelfRegister>
                                    </div>
                                    <div className="mb-3 hidden" id="corporateArea">
                                        <CorporateSelfRegister></CorporateSelfRegister>
                                    </div>
                                    <div className="mb-3 hidden" id="corporateArea">
                                        <AgentSelfRegister></AgentSelfRegister>
                                    </div>
                                </main>

                                <div className="pt-2 mt-5 text-center">
                                    <div>
                                    </div>

                                    <div className="flex justify-center gap-3">
                                    </div>
                                </div>

                                <div className="mt-12 text-center">
                                    
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