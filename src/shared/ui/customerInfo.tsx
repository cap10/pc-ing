'use client';

import { useEffect, useState } from "react";
import { getIndividualCustomerById } from "../services/main-service";
import { showToast } from "../utilities/commons";

export default function CustomerAccounts({custRef}:{custRef: string}) {
   
    const [customer, setCustomer] = useState(null);

    function getCustomer(){
        // console.log(custId);
        if(!custRef){
            // showToast('No customer reference found.', 'error');
            return;
        }
        
        getIndividualCustomerById(custRef)
        .then((data) => {
            // console.log(data);
            
            setCustomer(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get Customer.', 'error');
        })
    }

    useEffect(() => {
        getCustomer();
    }, []);

    return (
        <section>
            <div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-gray-900">Customer Information</h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">{custRef}</p>
                </div>
                {
                    customer ? (
                        <section>
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.customerName}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">National ID</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.nationalId}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.email}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Phone number</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.phoneNumber}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Address</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.address}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Status</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.customerStatus}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Reason</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <p>{customer.reason}</p>
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="mt-2 border-t">                            
                                <dl className="divide-y">                                
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Record History</dt>
                                        <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                                <li className="flex items-center justify-between py-2 pr-5 pl-4 text-sm/6">
                                                    <div className="flex w-0 flex-1 items-center">                                                    
                                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                            <span className="shrink-0 text-gray-400">modified by: </span>
                                                            <span className="truncate font-medium">{customer.lastModifiedBy}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center justify-between py-2 pr-5 pl-4 text-sm/6">
                                                    <div className="flex w-0 flex-1 items-center">
                                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                            <span className="shrink-0 text-gray-400">modified date: </span>
                                                            <span className="truncate font-medium">{customer.lastModifiedDate}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center justify-between py-2 pr-5 pl-4 text-sm/6">
                                                    <div className="flex w-0 flex-1 items-center">                                                    
                                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                            <span className="shrink-0 text-gray-400">created by: </span>
                                                            <span className="truncate font-medium">{customer.createdBy}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="flex items-center justify-between py-2 pr-5 pl-4 text-sm/6">
                                                    <div className="flex w-0 flex-1 items-center">
                                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                            <span className="shrink-0 text-gray-400">created date: </span>
                                                            <span className="truncate font-medium">{customer.createdDate}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </section>
                    ) : 
                    <div></div>
                }
            </div>
        </section>
    );
}