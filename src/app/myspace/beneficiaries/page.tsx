'use client';

import { getSessionDataByKey } from "@/shared/services/auth-service";
import CustomerBeneficiaries from "@/shared/ui/customerBeneficiary";
// import { Metadata } from "next";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: 'Individuals',
// };

export default function Beneficiaries() {

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
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Beneficiaries </h4>
                
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <nav className="flex space-x-4">
                    <button id="beneficiary-tab" className="font-medium px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-b-2 focus:border-b-black">
                        <i className="fa-solid fa-users-viewfinder text-slate-500"></i> Beneficiaries
                    </button>
                </nav>                
                {custId ? 
                    <div>
                        <div className="myTab p-4 mt-5 md:w-9/12 rounded-lg bg-gray-50" id="beneficiary" role="tabpanel" aria-labelledby="beneficiary-tab">
                            <CustomerBeneficiaries custRef={custId}></CustomerBeneficiaries>
                        </div>
                    </div>
                : <div></div>}
            </section>
        </main>
    );
}