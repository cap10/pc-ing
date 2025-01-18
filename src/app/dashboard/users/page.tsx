/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getClerkUsers, userStatus } from "@/shared/repositories/main-repository";
import { deleteUser, resetUserPassword } from "@/shared/services/main-service";
import UserForm from "@/shared/ui/userForm";
import { closeModal, openModal, showToast } from "@/shared/utilities/commons";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: 'Users',
// };

export default function Users() {

    const [users, setUsers] = useState(null);
    let userReference: string = '';

    function getUsers(){
        getClerkUsers(0, 100)
        .then((data) => {
            // console.log(data);

            setUsers(data.content);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get list of Users.', 'error');
        })
    }
    
    function disableUser(ref: string, mode: boolean){
        userStatus(ref, mode)
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

    function DeleteUser(){
        if(userReference){
            deleteUser(userReference)
                .then(() => {
                    // console.log(resp);
                    showToast('User deleted successfully.', 'success');
                    closeModal('modal-userdelete');
                    getUsers();
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

    function confirmUser(ref: string, modal: string){
        if(ref){
            userReference = ref;
            openModal(modal);
        }
    }

    useEffect(() => {
        getUsers();

    }, [])
    
    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Users</h4>
                <button type="button" className="p-1 text-white bg-color-secondary rounded-md" 
                onClick={() => openModal('modal-userform')}>
                    <i className="fa-regular fa-plus mr-2"></i>
                    New User
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
                                    Username
                                </th>
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
                                    National ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
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
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.phoneNumber}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.nationalId}    
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.group?.name}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.enabled ? 
                                            (<span className="rounded-full bg-green-500 text-white text-xs px-1.5 py-0.5">enabled</span>) : 
                                            (<span className="rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">disabled</span>)}
                                    </td>
                                    <td>
                                        {!u.enabled ? 
                                            (<span title="Enable User" onClick={() => disableUser(u.id, true)} className="text-green-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-user-check"></i></span>) : 
                                            (<span title="Disable User" onClick={() => disableUser(u.id, false)} className="text-gray-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-user-xmark"></i></span>)}
                                        <span title="Edit User" className="text-yellow-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-user-edit"></i></span>
                                        <span title="Reset User" onClick={() => confirmUser(u.id, 'modal-userreset')} className="text-blue-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-key"></i></span>
                                        <span title="Delete User" onClick={() => confirmUser(u.id, 'modal-userdelete')} className="text-red-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-trash"></i></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <UserForm></UserForm>

            <div className="relative z-50 hidden modal" id="modal-userdelete" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                                        <h4 className="font-semibold">You are about to delete a User.</h4>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-userdelete')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => DeleteUser()} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Delete
                                        <i className="fa-solid fa-trash ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
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
                                    <button onClick={() => closeModal('modal-userdelete')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
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

        </main>
    );
}