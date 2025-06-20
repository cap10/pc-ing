'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";
import {setSessionData} from "@/shared/repositories/storage-repository";

export default function Home() {

    const [accounts,  setAccounts] = useState<any>([]);
    const [transactions,  setTransactions] = useState<any>([]);
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

        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8 lg:mb-12">
                    <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
                        <div className="flex items-center group">
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-cyan-500 mr-3 transform group-hover:scale-110 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                </svg>
                                <div
                                    className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur"></div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                        </div>
                        <div
                            className="mt-4 h-1.5 w-32 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-500 rounded-full shadow-lg"></div>
                    </div>

                    <Link
                        href=""
                        className="group relative flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="h-5 w-5 mr-2 relative z-10 group-hover:animate-bounce" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <span className="relative z-10 font-semibold">Transfer Money</span>
                    </Link>
                </div>

                {/* Accounts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {accounts?.map((account) => (
                        <div
                            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border-l-4 border-cyan-500  overflow-hidden transform hover:scale-105 transition-all duration-300"
                            key={account?.id}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center">
                                        <div
                                            className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl shadow-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        {account?.accountStatus === 'PENDING_APPROVAL' ? (
                                            <span
                                                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 animate-spin" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Pending
                      </span>
                                        ) : account?.accountStatus === 'ACTIVE' ? (
                                            <span
                                                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        Active
                      </span>
                                        ) : account?.accountStatus === 'INACTIVE' ? (
                                            <span
                                                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        Inactive
                      </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                        </svg>
                                                {account?.customerStatus ? account?.customerStatus : 'Unknown'}
                      </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                                    {account?.accountName.split('-')[1]}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                    </svg>
                                    {account?.accountNumber}
                                </p>

                                <div className="flex justify-between items-center pt-4 border-t border-blue-300">
                                    <button
                                        onClick={() => getBalance(account.accountNumber)}
                                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Get Balance
                                    </button>
                                    <span className="text-2xl font-bold text-gray-800">
    {accountBalances[account.accountNumber]?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) ?? "0.00"}
  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {accounts?.map((account: any) => (
                        <div
                            className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300"
                            key={account?.id}>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        {account?.accountStatus == 'PENDING_APPROVAL' ? (
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Pending
                </span>
                                        ) : account?.accountStatus == 'ACTIVE' ? (
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  Active
                </span>
                                        ) : account?.accountStatus == 'INACTIVE' ? (
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Inactive
                </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                  </svg>
                                                {account?.customerStatus ? account?.customerStatus : 'Unknown'}
                </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{account?.accountName.split('-')[1]}</h3>
                                <p className="text-gray-500 text-sm mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                    </svg>
                                    {account?.accountNumber}
                                </p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => getBalance(account.accountNumber)}
                                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Get Balance
                                    </button>
                                    <span className="text-xl font-bold text-gray-800">
              {accountBalances[account.accountNumber]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }) ?? "0.00"}
            </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>*/}

                {/* Recent Transactions Section */}
                <section
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-2 rounded-xl mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Recent Transactions
                            </h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    #
                                </th>
                                <th scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        First Name
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        Last Name
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        Username
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                            {transactions?.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr key={index}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {transaction.firstName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {transaction.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            @{transaction.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all duration-200 font-medium">
                                                View
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200 font-medium">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div
                                                className="bg-gradient-to-br from-gray-100 to-slate-100 p-4 rounded-2xl mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                            </div>
                                            <p className="text-lg font-medium text-gray-600">No transactions found</p>
                                            <p className="text-sm text-gray-400 mt-1">Start making transactions to see
                                                them here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>

        /*<main className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/!* Header Section *!/}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">

                <div className="flex flex-col items-center mb-4 md:mb-0">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-cyan-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    </div>
                    <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-300 rounded-full"></div>
                </div>
                <Link href={''}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Transfer Money
                </Link>
            </div>
            <br/>
            <br/>

            {/!* Accounts Grid *!/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {accounts?.map((account: any) => (
                    <div
                        className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300"
                        key={account?.id}>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    {account?.accountStatus == 'PENDING_APPROVAL' ? (
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Pending
                </span>
                                    ) : account?.accountStatus == 'ACTIVE' ? (
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  Active
                </span>
                                    ) : account?.accountStatus == 'INACTIVE' ? (
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Inactive
                </span>
                                    ) : (
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                  </svg>
                                            {account?.customerStatus ? account?.customerStatus : 'Unknown'}
                </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{account?.accountName.split('-')[1]}</h3>
                            <p className="text-gray-500 text-sm mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                </svg>
                                {account?.accountNumber}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => getBalance(account.accountNumber)}
                                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    Get Balance
                                </button>
                                <span className="text-xl font-bold text-gray-800">
              {accountBalances[account.accountNumber]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }) ?? "0.00"}
            </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/!* Recent Transactions Section *!/}
            <section className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 mr-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    First Name
                                </div>
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    Last Name
                                </div>
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    Username
                                </div>
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {transactions?.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {transaction.firstName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        @{transaction.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            View
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        <p>No transactions found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>*/

    );
}