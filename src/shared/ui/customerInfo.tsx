'use client';

import { useEffect, useState } from "react";
import { approveCorporateCustomer, approveIndividualCustomer, changeCorporateCustomerStatus, changeIndividualCustomerStatus, getCorporateCustomerById, getIndividualCustomerById } from "../services/main-service";
import { closeModal, openModal, showToast } from "../utilities/commons";

export default function CustomerAccounts({custRef, typ}:{custRef: string, typ: string}) {
   
    const [customer, setCustomer] = useState(null);

    function getCustomer(){
        // console.log(typ);
        if(!custRef){
            // showToast('No customer reference found.', 'error');
            return;
        }
        
        if(typ == 'Individual'){
            getIndividualCustomerById(custRef)
            .then((data) => {
                // console.log(data);
                
                setCustomer(data);
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to get Customer.', 'error');
            });
        }
        else if(typ == 'Corporate'){
            getCorporateCustomerById(custRef)
            .then((data) => {
                // console.log(data);
                
                setCustomer(data);
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to get Customer.', 'error');
            });
        }
        else{
            showToast('Unknown type : ' + typ, 'error');
        }
    }

    function approveCustomer(){
        if(custRef && typ){

            const action = document.getElementById('input11');
            if(!action?.value){
                showToast('Select approval action.', 'error');
                return;
            }
            const reason = document.getElementById('input12');
            if(!reason?.value){
                showToast('Type a reason for approval action.', 'error');
                return;
            }

            const data = {
                "customerId": custRef,
                "approved": action?.value,
                "reason": reason.value
            };

            // console.log(data);
            

            if(typ == 'Individual') 
                approveIndividualCustomer(custRef, data)
                    .then((resp) => {
                        // console.log(resp);

                        if(resp.error){
                            showToast(resp.error + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.message){
                            showToast(resp.message + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.status == 400){
                            showToast(resp.detail + ': ' + resp.status, 'error');
                            
                            return;
                        }

                        showToast('Customer has been actioned.', 'success');
                        getCustomer();
                        closeModal('modal-custApprove');
                    })
                    .catch(err => {
                        console.log(err);
                        showToast('Failed to approve customer.', 'error');
                    }) 
            else
                approveCorporateCustomer(custRef, data)
                    .then((resp) => {
                        // console.log(resp);

                        if(resp.error){
                            showToast(resp.error + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.message){
                            showToast(resp.message + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.status == 400){
                            showToast(resp.detail + ': ' + resp.status, 'error');
                            
                            return;
                        }

                        showToast('Customer has been actioned.', 'success');
                        getCustomer();
                        closeModal('modal-custApprove');
                    })
                    .catch(err => {
                        console.log(err);
                        showToast('Failed to approve customer.', 'error');
                    });
        }
        else{
            showToast('No customer reference found or invalid type.', 'error');
        }
    } 

    function changeCustomerStatus(){
        if(custRef && typ){

            const action = document.getElementById('input01');
            if(!action?.value){
                showToast('Select approval action.', 'error');
                return;
            }
            const reason = document.getElementById('input02');
            if(!reason?.value){
                showToast('Type a reason for approval action.', 'error');
                return;
            }

            const data = {
                "customerId": custRef,
                "status": action?.value,
                "reason": reason.value
            };

            // console.log(data);
            

            if(typ == 'Individual') 
                changeIndividualCustomerStatus(custRef, data)
                    .then((resp) => {
                        // console.log(resp);

                        if(resp.error){
                            showToast(resp.error + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.message){
                            showToast(resp.message + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.status == 400){
                            showToast(resp.detail + ': ' + resp.status, 'error');
                            
                            return;
                        }

                        showToast('Customer status changed.', 'success');
                        getCustomer();
                        closeModal('modal-custStatus');
                    })
                    .catch(err => {
                        console.log(err);
                        showToast('Failed to change customer status.', 'error');
                    }) 
            else
                changeCorporateCustomerStatus(custRef, data)
                    .then((resp) => {
                        // console.log(resp);

                        if(resp.error){
                            showToast(resp.error + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.message){
                            showToast(resp.message + ': ' + resp.status, 'error');
                            
                            return;
                        }
                        else if(resp.status == 400){
                            showToast(resp.detail + ': ' + resp.status, 'error');
                            
                            return;
                        }

                        showToast('Customer status changed.', 'success');
                        getCustomer();
                        closeModal('modal-custStatus');
                    })
                    .catch(err => {
                        console.log(err);
                        showToast('Failed to change customer status.', 'error');
                    });
        }
        else{
            showToast('No customer reference found or invalid type.', 'error');
        }
    }

    useEffect(() => {
        getCustomer();
    }, []);

    return (
        <section>
            <div>
                <div className="px-4 sm:px-0 grid grid-cols-2">
                    <div className="">
                        <h3 className="text-base/7 font-semibold text-gray-900">Customer Information</h3>
                        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">{custRef}</p>
                    </div>
                    <div className="text-right"> 
                        {customer?.customerStatus == 'PENDING' ?
                            <span className="border rounded-md btn border-green-300 px-4 py-1 cursor-pointer text-green-400" onClick={() => openModal('modal-custApprove')}>
                                <i className="fa-solid fa-file-circle-check"></i> Approve Customer
                            </span> 
                            : <span></span>
                        }
                    </div>
                </div>
                {
                    customer ? (
                        <section>
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {customer.customerName ? customer.customerName : customer.companyName}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">
                                            {typ == 'Individual' ? 'National ID' : 'Registration Number'}
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {customer.nationalId ? customer.nationalId : customer.registrationNumber}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.email}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Phone number</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {customer.phoneNumber ? customer.phoneNumber : customer.telephoneNumber}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Address</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.address}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">No. of Approvers</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customer.numberOfRequiredApproversPerTransaction}</dd>
                                    </div>
                                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Status</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {customer.customerStatus}
                                            <span className="ml-5 border rounded-md btn border-amber-300 px-4 py-1 cursor-pointer text-amber-400" onClick={() => openModal('modal-custStatus')}>
                                                <i className="fa-solid fa-file-circle-check "></i> Change Status
                                            </span> 
                                        </dd>
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

            <div className="relative z-50 hidden modal" id="modal-custApprove" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Approve Customer
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to approve a customer.</h4>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input11">Action</label>
                                        <select name="approved" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input11" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            <option value="true">Approve</option>
                                            <option value="false">Reject</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input12">Reason</label>
                                        <textarea id="input12" className="block w-full mt-2 border p-2 border-gray-200 rounded focus:ring-2 focus:ring-offset-0 focus:ring-violet-500/30 focus:border-violet-200 py-1.5 " rows={3} placeholder="Type reason"></textarea>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-custApprove')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => {approveCustomer()}} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Proceed
                                        <i className="fa-solid fa-arrow-right ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-50 hidden modal" id="modal-custStatus" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Change Customer Status
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to change customer status.</h4>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input01">Action</label>
                                        <select name="status" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input01" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="BLOCKED">Blocked</option>
                                            <option value="REJECTED">Reject</option>
                                            <option value="PENDING">Pending</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input02">Reason</label>
                                        <textarea id="input02" className="block w-full mt-2 border p-2 border-gray-200 rounded focus:ring-2 focus:ring-offset-0 focus:ring-violet-500/30 focus:border-violet-200 py-1.5 " rows={3} placeholder="Type reason"></textarea>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-custStatus')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => {changeCustomerStatus()}} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Proceed
                                        <i className="fa-solid fa-arrow-right ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}