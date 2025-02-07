'use client';

import { getIndividualCustomerById } from "@/shared/services/main-service";
import CustomerAccounts from "@/shared/ui/customerAccounts";
import CustomerBeneficiaries from "@/shared/ui/customerBeneficiary";
import CustomerInfo from "@/shared/ui/customerInfo";
import CustomerUsers from "@/shared/ui/customerUsers";
import { showToast } from "@/shared/utilities/commons";
// import { Metadata } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: 'Individuals',
// };

export default function CustomerInfoIndi(
    {params} : {params: Promise<{id: string}>}
) {

    const [custId, setCustId] = useState('');
    let dummy = '';

    function customer(){
        // console.log(custId);
        if(!dummy){
            showToast('No customer reference found.', 'error');
            return;
        }
        
        setCustId(dummy);
        
    }

    function showTab(tabRef: string){
        const x = document.querySelectorAll("div.myTab");
        // console.log(x);
        x.forEach(elem => {
            // console.log(elem.id);
            document.getElementById(elem.id).style.display = 'none';
        });
        
        if(tabRef){
            const elem = document.getElementById(tabRef);
            if(elem) elem.style.display = 'block';
        }
    }

    useEffect(() => {
        params.then(p => {
            // console.log(p);            
            dummy = p.id;
            customer();
        });

    }, []);

    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Individual Customer </h4>
                <Link href="/dashboard/customers/individuals" className="button p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    View Customers
                </Link>
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <nav className="flex space-x-4">
                    <button id="info-tab" onClick={() => showTab("info") } className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-circle-info text-slate-500"></i> Information
                    </button>
                    <button id="accounts-tab" onClick={() => showTab("accounts")} className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-money-bills text-slate-500"></i> Accounts
                    </button>
                    <button id="beneficiary-tab" onClick={() => showTab("beneficiary")} className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-users-viewfinder text-slate-500"></i> Beneficiaries
                    </button>
                    <button id="users-tab" onClick={() => showTab("users")} className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-users text-slate-500"></i> Users
                    </button>
                </nav>                
                {custId ? 
                    <div>
                        <div className="myTab p-4 mt-5 md:w-9/12 rounded-lg bg-gray-50" id="info" role="tabpanel" aria-labelledby="info-tab">
                            <CustomerInfo typ={'Individual'} custRef={custId}></CustomerInfo>
                        </div>
                        <div className="myTab hidden p-4 mt-5 md:w-9/12 rounded-lg bg-gray-50" id="accounts" role="tabpanel" aria-labelledby="accounts-tab">
                            <CustomerAccounts custRef={custId}></CustomerAccounts>
                        </div>
                        <div className="myTab hidden p-4 mt-5 md:w-9/12 rounded-lg bg-gray-50" id="beneficiary" role="tabpanel" aria-labelledby="beneficiary-tab">
                            <CustomerBeneficiaries custRef={custId}></CustomerBeneficiaries>
                        </div>
                        <div className="myTab hidden p-4 mt-5 rounded-lg bg-gray-50" id="users" role="tabpanel" aria-labelledby="users-tab">
                            <CustomerUsers typ={'INDIVIDUAL'}  custRef={custId}></CustomerUsers>
                        </div>
                    </div>
                : <div></div>}
            </section>
        </main>
    );
}