'use client';

import { getSessionDataByKey } from "@/shared/services/auth-service";
import CustomerAccounts from "@/shared/ui/customerAccounts";
import Link from "next/link";
// import { Metadata } from "next";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: 'Individuals',
// };

export default function ManageAccounts() {

    const [custId, setCustId] = useState('');
    let custRef = '';
    
    function setAccountId(){
        // console.log(custRef);            

        if(custRef){
            setCustId(custRef)
        }
        else{
            // showToast('Customer reference not found.', 'error');
        }
    }

    useEffect(() => {

        const refe = sessionStorage.getItem('refe');

        if(refe) {
            getSessionDataByKey(refe)
            .then(cid => {
                // console.log(refe, cid);
                if(cid) custRef = cid;
                
                setAccountId();
            });

        }
    }, []);

    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Manage Accounts </h4>
                <Link href="/myspace/accounts" className="button p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back
                </Link>
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <nav className="flex space-x-4">
                    <button id="accounts-tab" className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-money-bills text-slate-500"></i> Accounts
                    </button>
                </nav>                
                {custId ? 
                    <div>
                        <div className="myTab p-4 mt-5 md:w-9/12 rounded-lg bg-gray-50" id="accounts" role="tabpanel" aria-labelledby="accounts-tab">
                            <CustomerAccounts custRef={custId}></CustomerAccounts>
                        </div>
                    </div>
                : <div></div>}
            </section>
        </main>
    );
}