'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";
import {setSessionData} from "@/shared/repositories/storage-repository";

export default function Home() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [accountBalances, setAccountBalances] = useState<Record<string, number>>({});
    //const [accountBalances, setAccountBalances] = useState<any>();
    const [loading, setLoading] = useState(false);

    let customerId:any;

    if ( typeof window !== 'undefined') {
        // Perform localStorage action
        customerId = sessionStorage.getItem('customerId');
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

                showToast("Failed to fetch accounts", 'error');
            });

    }, []);

    /*const getBalance = async (accountNumber: any) => {

        try {
            const response = await axiosClient.get(`v1/customer-accounts/${accountNumber}/balance`)
            if (response != null) {

                setAccountBalances(response?.data?.balance);
                console.log("Account Balance", response?.data?.balance);

            } else {
                showToast("Failed to fetch balance", 'error');
            }
        } catch (err: any) {
            showToast(err?.response?.data?.message, 'error');
        }
    }*/

    const getBalance = async (accountNumber: string) => {
        try {
            const response = await axiosClient.get(`v1/customer-accounts/${accountNumber}/balance`);
            if (response.data) {
                setAccountBalances(prev => ({
                    ...prev,
                    [accountNumber]: response.data.balance
                }));
                console.log("Account Balance", response.data.balance);
            } else {
                showToast("Failed to fetch balance", 'error');
            }
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Error fetching balance", 'error');
        }
    };

    return (

        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Dashboard</h4>
                <Link href={'/myspace/transfers'} type="button" className="p-1 text-white bg-color-primary rounded-md">Transfer
                    Money</Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                {accounts?.map((account: any) => (
                    <div className="card p-5 rounded-2xl border-2 border-cyan-500" key={account?.id}>
                        <div className="card-body">
                            <div className="grid grid-cols-2 mb-4">
                                <div>
                                    <Image
                                        width={100}
                                        height={200}
                                        src="/images/logo-mini.png"
                                        alt=""
                                        className="inline-block w-5 align-middle"
                                        id="mini-logo"
                                    />
                                </div>
                                <div className="text-right pt-2">
                                    {account?.accountStatus == 'PENDING_APPROVAL' ? (
                                        <span
                                            className="rounded-md bg-amber-100 text-amber-600 font-bold text-xs p-2"> Pending
              </span>
                                    ) : account?.accountStatus == 'ACTIVE' ? (
                                        <span
                                            className="rounded-full bg-green-200 text-green-600 text-xs px-1.5 py-0.5">
                active
              </span>
                                    ) : account?.accountStatus == 'INACTIVE' ? (
                                        <span
                                            className="rounded-full bg-yellow-200 text-yellow-600 text-xs px-1.5 py-0.5">
                inactive
              </span>
                                    ) : (
                                        <span className="rounded-full bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5">
                {account?.customerStatus ? account?.customerStatus : 'null'}
              </span>
                                    )}
                                </div>
                            </div>
                            <h4 className="font-bold m-2">{account?.accountName.split('-')[1]}</h4>
                            <h6 className="text-gray-500">
                                {account?.accountNumber}
                            </h6>
                            <div className="mt-5">
          <span
              className="text-cyan-500 cursor-pointer hover:underline"
              onClick={() => getBalance(account.accountNumber)} // Pass accountNumber here
          >
            Get Balance
          </span>
                                <span className="font-bold ml-6">
          {(accountBalances[account.accountNumber]?.toFixed(2)) ?? "565,7"}
        </span>
                            </div>
                        </div>
                    </div>
                ))}
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