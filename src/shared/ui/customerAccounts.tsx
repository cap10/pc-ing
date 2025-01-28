'use client';

import { useEffect, useState } from "react";
import { customerAccountApproval, getCustomerAccounts, updateCustomerAccount } from "../services/main-service";
import { closeModal, openModal, showToast } from "../utilities/commons";


export default function CustomerAccounts({custRef}:{custRef: string}) {
   
    const [accounts, setAccounts] = useState(null);
    let accReference = '';
    
    function getAccounts(){
        // console.log(custId);
        if(!custRef){
            // showToast('No customer reference found.', 'error');
            return;
        }
        
        getCustomerAccounts(custRef)
        .then((data) => {
            // console.log(data);
            
            setAccounts(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get Customer accounts.', 'error');
        })
    }

    function confirmAcc(ref: string, modal: string, mode: string){
        if(ref){
            accReference = ref;

            if(mode == 'edit'){
                accounts.forEach(r => {
                    if(r.id == ref){
                        // console.log(r);
                        
                        const name = document.getElementById('input10');
                        const num = document.getElementById('input20');
                        const typ = document.getElementById('input30');

                        if(name && num && typ){
                            name.value = r.accountName;
                            num.value = r.accountNumber;
                            typ.value = r.accountType;
                        }
                    }
                });
            }
            else{}
            
            openModal(modal);
        }
    }

    function approveAccount(){
        if(accReference){

            const action = document.getElementById('input11');
            if(!action?.value){
                showToast('Select approval action.', 'error');
                return;
            }

            customerAccountApproval(accReference, action.value)
                .then((resp) => {
                    console.log(resp);

                    if(resp.error){
                        showToast(resp.error + ': ' + resp.status, 'error');
                        
                        return;
                    }

                    showToast('Acount status has been changed.', 'success');
                    getAccounts();
                    closeModal('modal-accApprove');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Failed to approve account.', 'error');
                });
        }
        else{
            showToast('No account reference found.', 'error');
        }
    } 

    function updateAccDetail(formData: FormData){
        const name = formData?.get('name')?.toString();
        const number = formData?.get('number')?.toString();
        const typ = formData?.get('typ')?.toString();

        if(name && number && typ){
            // console.log(name, number, typ);
            
            const rec = {
                "accountNumber": number,
                "accountType": typ,
                "accountName": name
            };        

            // console.log(rec);
            
            updateCustomerAccount(accReference, rec)
            .then(resp => {
                console.log(resp);
                
                if(resp?.message){
                    showToast(resp.message, 'error');
                    return;
                }
                else if(resp?.error){
                    showToast(resp.error + `(${resp.status})`, 'error');
                    return;
                }
    
                showToast('Account updated successfully.', 'success');
    
                getAccounts();
    
                closeModal('modal-editAcc');
    
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to update customer account.', 'error');
            })
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    useEffect(() => {
        getAccounts();
    }, []);

    return (
        <section>
            <div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-gray-900">Customer Accounts</h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">{custRef}</p>
                </div>
                {
                    accounts ? (
                        <section>
                            <div className="mt-6 border-t border-gray-100">
                                <div className="mt-5 overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-sm text-gray-700 bg-gray-200">
                                            <tr className="">
                                                <th scope="col" className="px-6 py-3">
                                                    Account Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Account Type
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Account Number
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accounts?.map((u: any) => (
                                                <tr className="bg-white border border-gray-200" key={u.id}>
                                                    <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                                        {u.accountName}
                                                    </th>
                                                    <td className="px-6 py-3.5">
                                                        {u.accountType}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.accountNumber}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.accountStatus == 'PENDING_APPROVAL' ? 
                                                            (<span className="rounded-full bg-blue-500 text-white text-xs px-1.5 py-0.5">pending</span>) : 
                                                            (<span className="rounded-full bg-gray-500 text-white text-xs px-1.5 py-0.5">{u.customerStatus ? u.customerStatus : 'null'}</span>)}
                                                    </td>
                                                    <td className="text-center">
                                                        {u.accountStatus == 'PENDING_APPROVAL' ? 
                                                            (<span title="Approve Account" onClick={() => {confirmAcc(u.id, 'modal-accApprove', 'approve')}} className="text-green-500 px-1 py-0.5 cursor-pointer"><i className="fa-regular fa-circle-check"></i></span>) : 
                                                            (<span title="No Action" className="text-gray-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-circle-half-stroke"></i></span>)}
                                                        <span title="Edit Account" onClick={() => {confirmAcc(u.id, 'modal-editAcc', 'edit')}} className="text-yellow-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-edit"></i></span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    ) : 
                    <div></div>
                }
            </div>

            <div className="relative z-50 hidden modal" id="modal-accApprove" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Approve Account
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to change account status.</h4>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input11">Action</label>
                                        <select name="action" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input11" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            <option value="APPROVE">Approve</option>
                                            <option value="REJECT">Reject</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-accApprove')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => {approveAccount()}} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Proceed
                                        <i className="fa-solid fa-arrow-right ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-50 hidden modal" id="modal-editAcc" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <form action={updateAccDetail}>
                                <div className="bg-white">
                                    <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 ">
                                            Update Account Details
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input30">Account Type</label>
                                            <select name="typ" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input30" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                <option value="CURRENT">Current</option>
                                                <option value="DEPOSIT">Deposit</option>
                                                <option value="SAVINGS">Savings</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input10">Account Name</label>
                                            <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input10" placeholder="name" required/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input20">Account Number</label>
                                            <input name="number" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input20" placeholder="number" required/>
                                        </div>
                                    </div>
                                    <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                        <button onClick={() => closeModal('modal-editAcc')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                            <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                            Cancel
                                        </button>
                                        <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                            Update
                                            <i className="fa-regular fa-save ml-2 mt-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}