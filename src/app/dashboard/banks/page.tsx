'use client';

import { activateDeactivateBank, deleteBank, getAllBanks } from "@/shared/services/main-service";
import BankForm from "@/shared/ui/bankForm";
import { closeModal, openModal, showToast } from "@/shared/utilities/commons";
import { useEffect, useState } from "react";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: 'Configs',
// };

export default function Banks() {

    const [banks, setBanks] = useState(null);
    let bankReference: string = '';

    function getBanks(){
        getAllBanks()
        .then((data) => {
            // console.log(data);

            setBanks(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get list of Banks.', 'error');
        })
    }
    
    function changeBankStatus(ref: string, mode: string){
        activateDeactivateBank(ref, mode)
        .then(() => {
            // console.log(resp);
            showToast('Bank status changed successfully.', 'success');
            getBanks();
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to change bank status.', 'error');
        })
        
    }

    function DeleteBank(){
        if(bankReference){
            deleteBank(bankReference)
                .then(() => {
                    // console.log(resp);
                    showToast('Bank deleted successfully.', 'success');
                    closeModal('modal-bankdelete');
                    getBanks();
                })
                .catch(err => {
                    console.log(err);
                    showToast('Failed to delete bank.', 'error');
                });
        }
        else{
            showToast('No bank reference found.', 'error');
        }
    }   

    function confirmBank(ref: string, modal: string){
        if(ref){
            bankReference = ref;
            openModal(modal);
        }
    }

    useEffect(() => {
        getBanks();
    }, [])

    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Users</h4>
                <button type="button" className="p-1 text-white bg-color-secondary rounded-md" 
                onClick={() => openModal('modal-bankform')}>
                    <i className="fa-regular fa-plus mr-2"></i>
                    New Bank
                </button>
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
                <div className="mt-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                            <tr className="">
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    BIN
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Swift Code
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks?.map((u: any) => (
                                <tr className="bg-white border border-gray-200" key={u.id}>
                                    <td className="px-6 py-3.5">
                                        {u.bankName}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.bin}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.swiftCode}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.active ? 
                                            (<span className="rounded-full bg-green-500 text-white text-xs px-1.5 py-0.5">enabled</span>) : 
                                            (<span className="rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">disabled</span>)}
                                    </td>
                                    <td>
                                        {!u.active ? 
                                            (<span title="Activate Bank" onClick={() => changeBankStatus(u.id, 'activate')} className="text-green-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-check-square"></i></span>) : 
                                            (<span title="Deactivate Bank" onClick={() => changeBankStatus(u.id, 'deactivate')} className="text-gray-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-times-square"></i></span>)}
                                        <span title="Delete Bank" onClick={() => confirmBank(u.id, 'modal-bankdelete')} className="text-red-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-trash"></i></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <BankForm></BankForm>

            <div className="relative z-50 hidden modal" id="modal-bankdelete" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Delete Bank
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to delete a Bank.</h4>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-userdelete')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => DeleteBank()} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Delete
                                        <i className="fa-solid fa-trash ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}