'use client';

import { useEffect, useState } from "react";
import { changeUserStatus, createCustomerUser, deleteUser, getCustomerUsers, updateUser } from "../services/main-service";
import { closeModal, openModal, showToast } from "../utilities/commons";
import UserRightsForm from "./userRightsForm";
import { resetUserPassword } from "../services/auth-service";

export default function CustomerUsers({custRef, typ}:{custRef: string, typ: string}) {
    
    const [users, setUsers] = useState(null);
    let userReference = '';
    
    function getUsers(){
        // console.log(custId);
        if(!custRef){
            // showToast('No customer reference found.', 'error');
            return;
        }
        
        getCustomerUsers(custRef, 0, 100)
        .then((data) => {
            // console.log(data);
            
            setUsers(data.content);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get Customer users.', 'error');
        })
    }

    function confirmUser(ref: string, modal: string, mode: string){
        if(ref){
            userReference = ref;

            if(mode == 'edit'){
                users.forEach(r => {
                    if(r.id == ref){
                        // console.log(r);
                        
                        const acc = document.getElementById('input1');
                        const bank = document.getElementById('input2');
                        const name = document.getElementById('input3');

                        if(name && bank && acc){
                            name.value = r.beneficiaryName;
                            acc.value = r.accountNumber;
                            bank.value = r.bank.id;
                        }
                    }
                });
            }
            else{}
            
            openModal(modal);
        }
    }

    function deleteCustUser(){
        if(userReference){

            deleteUser(userReference)
                .then((resp) => {
                    console.log(resp);

                    showToast('User has been deleted.', 'success');
                    getUsers();
                    closeModal('modal-userDelete');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Failed to delete user.', 'error');
                });
        }
        else{
            showToast('No user reference found.', 'error');
        }
    } 

    function updateUserDetail(formData: FormData){
        const name = formData?.get('name')?.toString();
        const number = formData?.get('account')?.toString();
        const bank = formData?.get('bank')?.toString();

        if(name && number && bank){
            // console.log(name, number, typ);
            
            const rec = {
                "accountNumber": number,
                "bankId": bank,
                "beneficiaryName": name,                
                "customerId": custRef
            };        

            // console.log(rec);
            
            updateUser(userReference, rec)
            .then(resp => {
                // console.log(resp);
                
                if(resp?.message){
                    showToast(resp.message, 'error');
                    return;
                }
                else if(resp?.error){
                    showToast(resp.error + `(${resp.status})`, 'error');
                    return;
                }
    
                showToast('User updated successfully.', 'success');
    
                getUsers();
    
                closeModal('modal-editUser');
    
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to update customer user.', 'error');
            })
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    function createUser(formData: FormData){
        const name = formData?.get('name')?.toString();
        const uname = formData?.get('username')?.toString();
        const email = formData?.get('email')?.toString();
        const natid = formData?.get('nationalId')?.toString();
        const number = formData?.get('phone')?.toString();
        const role = formData?.get('role')?.toString();

        if(name && number && uname && email && natid && role){
            // console.log(name, number, typ);
            
            const rec = {
                "email": email,
                "username": uname,
                "name": name,
                "nationalId": natid,
                "userRight": role,
                "phoneNumber": number,
                "customerId": custRef,
                "customerType": typ
            };        

            // console.log(rec);
            
            createCustomerUser(rec)
            .then(resp => {
                // console.log(resp);
                
                if(resp?.message){
                    showToast(resp.message, 'error');
                    return;
                }
                else if(resp?.error){
                    showToast(resp.error + `(${resp.status})`, 'error');
                    return;
                }
                else if(resp?.status == 400){
                    showToast(resp.detail + `(${resp.status})`, 'error');
                    return;
                }
    
                showToast('User created successfully.', 'success');
    
                getUsers();
    
                closeModal('modal-addUser');
    
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to add user.', 'error');
            })
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    function disableUser(ref: string, mode: boolean){
        changeUserStatus(ref, mode)
        .then(() => {
            // console.log(resp);
            showToast('User status changed successfully.', 'success');
            getUsers();
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to change user status.', 'error');
        })
        
    }

    function ResetUser(){
        if(userReference){
            resetUserPassword(userReference)
                .then(() => {
                    // console.log(resp);
                    showToast('User password reset successful.', 'success');
                    // getUsers();
                    closeModal('modal-userreset');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Failed to reset user.', 'error');
                });
        }
        else{
            showToast('No user reference found.', 'error');
        }
    } 

    useEffect(() => {
        getUsers();
        
    }, []);

    return (
        <section>
            <div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-gray-900">Customer Users</h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-dgray-500">{custRef}</p>
                </div>
                {
                    users ? (
                        <section>
                            <div className="mt-6 border-t border-gray-100">
                                <div className="mt-2 text-right">
                                    <span className="mr-3 text-color-secondary font-bold cursor-pointer text-sm" onClick={() => {openModal('modal-addUser')}}>
                                        <i  className="fa-solid fa-plus mr-1"></i> Add
                                    </span>
                                </div>
                                <div className="mt-5 overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-sm text-gray-700 bg-gray-200">
                                            <tr className="">
                                                <th scope="col" className="px-6 py-3">
                                                    Username
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    NationalId
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Phone
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Permissions
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users?.map((u: any) => (
                                                <tr className="bg-white border border-gray-200" key={u.id}>
                                                    <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                                        {u.username}
                                                    </th>
                                                    <td className="px-6 py-3.5">
                                                        {u.name}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.nationalId}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.email}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.phoneNumber}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {
                                                            u?.permissions?.map((p: any) => (
                                                                <span key={p.id}>{p.authority}, </span>
                                                            ))
                                                        }
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.enabled ? 
                                                            (<span className="rounded-full bg-green-500 text-white text-xs px-1.5 py-0.5">enabled</span>) : 
                                                            (<span className="rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">disabled</span>)}
                                                    </td>
                                                    <td className="text-center">
                                                        {!u.enabled ? 
                                                            (<span title="Enable User" onClick={() => disableUser(u.id, true)} className="text-green-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-user-check"></i></span>) : 
                                                            (<span title="Disable User" onClick={() => disableUser(u.id, false)} className="text-gray-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-user-xmark"></i></span>)}
                                                        <span title="Reset User" onClick={() => confirmUser(u.id, 'modal-userreset', 'reset')} className="text-blue-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-key"></i></span>
                                                        <br />
                                                        <span title="Edit User" onClick={() => {confirmUser(u.id, 'modal-editUser', 'edit')}} className="text-yellow-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-edit"></i></span>
                                                        <span title="Delete User" onClick={() => {confirmUser(u.id, 'modal-userDelete', 'delete')}} className="text-red-500 px-1 py-0.5 cursor-pointer"><i className="fa-regular fa-trash-alt"></i></span>
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

            <div className="relative z-50 hidden modal" id="modal-userDelete" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Delete User
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to delete a user.</h4>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-userDelete')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => {deleteCustUser()}} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Proceed
                                        <i className="fa-solid fa-arrow-right ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UserRightsForm myFunc={createUser} enableUsername={true}></UserRightsForm>

            <div className="relative z-50 hidden modal" id="modal-editUser" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <form action={updateUserDetail}>
                                <div className="bg-white">
                                    <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 ">
                                            Update User Details
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input1">Customer Account</label>
                                            <select name="account" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input1" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input2">Bank</label>
                                            <select name="bank" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input2" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input3">Beneficiary Name</label>
                                            <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input3" placeholder="name" required/>
                                        </div>
                                    </div>
                                    <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                        <button onClick={() => closeModal('modal-editUser')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
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
            
            <div className="relative z-50 hidden modal" id="modal-userreset" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Reset User Password
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to reset password for a User.</h4>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-userreset')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => ResetUser()} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Reset
                                        <i className="fa-solid fa-key ml-2 mt-1"></i>
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