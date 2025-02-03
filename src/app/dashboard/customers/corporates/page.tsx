'use client';

import { getCorporateCustomers } from "@/shared/services/main-service";
import { showToast } from "@/shared/utilities/commons";
import Link from "next/link";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: 'Corporates',
// };

export default function Corporates() {

    const [customers, setCustomers] = useState(null);
    
    function getCustomers(){
        getCorporateCustomers(0, 100)
        .then((data) => {
            // console.log(data);

            setCustomers(data.content);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get list of Customers.', 'error');
        })
    }

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Corporate Customers</h4>
                <Link href="/dashboard/customers/corporates/new" className="button p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-regular fa-plus mr-2"></i>
                    New Customer
                </Link>
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <div className="flex columns-2 justify-between">
                    <div>                    
                        <form className="max-w-md mx-auto">   
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative w-72">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." required />
                                {/* <button type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button> */}
                            </div>
                        </form>
                    </div>
                    <div className="flex">
                        <button type="button" className="bg-white border border-gray-400 rounded-xl px-2 py-1 pt-1.5 flex hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span className="ml-1">PDF</span>
                        </button>
                        <button type="button" className="bg-white border border-gray-400 rounded-xl px-2 py-1 pt-1.5 flex hover:bg-gray-200 ml-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            <span className="ml-1">Filter</span>
                        </button>
                    </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                            <tr className="">
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Reg. Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers?.map((u: any) => (
                                <tr className="bg-white border border-gray-200" key={u.id}>
                                    <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                        {u.companyName}
                                    </th>
                                    <td className="px-6 py-3.5">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.telephoneNumber}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.registrationNumber}    
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.customerStatus == 'PENDING' ? (<span className="rounded-full bg-blue-500 text-white text-xs px-1.5 py-0.5">pending</span>) : 
                                        u.customerStatus == 'ACTIVE' ? (<span className="rounded-full bg-green-500 text-white text-xs px-1.5 py-0.5">active</span>) : 
                                        u.customerStatus == 'REJECTED' ? (<span className="rounded-full bg-amber-500 text-white text-xs px-1.5 py-0.5">rejected</span>) : 
                                        u.customerStatus == 'BLOCKED' ? (<span className="rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">blocked</span>) : 
                                            (<span className="rounded-full bg-gray-500 text-white text-xs px-1.5 py-0.5">{u.customerStatus ? u.customerStatus : 'null'}</span>)}
                                    </td>
                                    <td className="text-center">
                                        <Link href={"corporates/"+u.id} title="View Customer" className="text-color-secondary px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-eye"></i></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}