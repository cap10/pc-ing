'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";

export default function Home() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [balances,  setBalances] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    let customerId:any;

    if ( typeof window !== 'undefined') {
        // Perform localStorage action
        customerId = localStorage.getItem('organisationId');
    }

    useEffect(() => {
        //get customers
        axiosClient.get(`v1/customer-accounts/customers?customerId=${customerId}`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setAccounts(res.data);
                setLoading(false);
            })
            .catch((err:any) => {
                setLoading(false);
                showToast("Failed to fetch accounts", 'error');
            });

        //get balances
        axiosClient.get(`v1/customer-accounts/${customerId}/balance`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setBalances(res.data);
                setLoading(false);
            })
            .catch((err:any) => {
                setLoading(false);
                showToast("Failed to fetch accounts", 'error');
            });

    }, []);

    return (

        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Dashboard</h4>
                <Link href={'/myspace/transfers'} type="button" className="p-1 text-white bg-color-primary rounded-md">Transfer
                    Money</Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">

                {
                    accounts?.map((account: any) => (
                        <div className="card p-5 border-2 rounded-2xl border-blue-700" key={account?.id}>
                            <div className="card-body">
                                <div className="grid grid-cols-2 mb-4">
                                    <div>
                                        <Image width={100} height={200} src="/images/logo-mini.png" alt=""
                                               className="inline-block w-5 align-middle" id="mini-logo"/>
                                    </div>
                                    <div className="text-right pt-2">
                                        {account?.accountStatus == 'PENDING_APPROVAL' ?
                                            (<span
                                                className="rounded-full bg-blue-200 text-blue-600 font-bold text-xs px-1.5 py-0.5"> pending </span>) :
                                            account?.accountStatus == 'ACTIVE' ?
                                                (<span
                                                    className="rounded-full bg-green-200 text-green-600 text-xs px-1.5 py-0.5">active</span>) :
                                                account?.accountStatus == 'INACTIVE' ?
                                                    (<span
                                                        className="rounded-full bg-yellow-200 text-yellow-600 text-xs px-1.5 py-0.5">inactive</span>) :
                                                    (<span
                                                        className="rounded-full bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5">{account?.customerStatus ? account?.customerStatus : 'null'}</span>)}
                                    </div>
                                </div>
                                <h4 className="font-bold">{account?.accountName}</h4>
                                <h6 className="text-gray-500">{account?.accountNumber} ({account?.accountType})</h6>
                                <div className="mt-5">
                                    <span className="text-gray-500">ZWL $</span>
                                    <span className="font-bold ml-2">0.00</span>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>

            <div className="grid grid-cols-3 gap-4 mt-5">

                <div className="card p-5 border rounded-2xl border-gray-400 col-span-2">
                    <div className="card-body">
                        <h4 className="font-bold">Recent Bill Payment</h4>
                        <div className="mt-5 grid grid-cols-5 gap-2">

                            <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span>
                                    </div>
                                    <span className="font-semibold">dummy <br/> (ZWL)</span>
                                </div>
                            </div>

                            {/* <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span> 
                                    </div>
                                    <span className="font-semibold">Buy Airtime <br /> (ZWL)</span>
                                </div>
                            </div>

                            <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span> 
                                    </div>
                                    <span className="font-semibold">ZESA Prepaid <br /> (ZWL)</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="card p-5 border rounded-2xl border-gray-400">
                    <div className="card-body">
                        <h6 className="text-gray-500">Interbank Exchange Rate</h6>
                        <h4 className="font-bold">ZWL 800 : 1 USD</h4>
                        <div className="mt-5">
                            <em>#chart</em>
                        </div>
                    </div>
                </div>

            </div>

            <section className="mt-5 pt-4">
                <h4 className="font-bold">Recent Transactions</h4>
                <div className="mt-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                        <tr className="">
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3">
                                First Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    1
                                </th>
                                <td className="px-6 py-3.5">
                                    Mark
                                </td>
                                <td className="px-6 py-3.5">
                                    Otto
                                </td>
                                <td className="px-6 py-3.5">
                                    @mdo
                                </td>
                            </tr>
                            <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    2
                                </th>
                                <td className="px-6 py-3.5">
                                    Jacob
                                </td>
                                <td className="px-6 py-3.5">
                                    Thornton
                                </td>
                                <td className="px-6 py-3.5">
                                    @fat
                                </td>
                            </tr>
                            <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    3
                                </th>
                                <td className="px-6 py-3.5">
                                    Larry
                                </td>
                                <td className="px-6 py-3.5">
                                    the Bird
                                </td>
                                <td className="px-6 py-3.5">
                                    @twitter
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </section>

        </main>

    );
}