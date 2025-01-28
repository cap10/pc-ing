'use client';

import AccountForm from "@/shared/ui/accountForm";
import { closeModal, openModal, showToast } from "@/shared/utilities/commons";
import { createIndividualCustomerUtil } from "@/shared/utilities/utils";
// import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// export const metadata: Metadata = {
//     title: 'Individuals',
// };

export default function NewIndividual() {

    const [myAccs, setMyAccs] = useState<any[]>([]);
    const router = useRouter();

    function addAccDetail(formData: FormData){
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

            
            myAccs.push(rec);
            setMyAccs(myAccs);
            
            renderData(myAccs);

            closeModal('modal-addAcc');
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    function renderData(data: any[]){
        let tbdy = '';
        if(data){
            data.forEach((u: any) => {
                tbdy += `
                    <tr style="border: 1px solid rgb(229 231 235);">
                        <th scope="row" style="padding: 0.3rem 3rem;" className="font-medium text-gray-900 whitespace-nowrap">
                            ${u.accountType}
                        </th>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.accountName}
                        </td>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.accountNumber}
                        </td>
                    </tr>
                `
            });
        }

        const elem = document.getElementById('mytbody');
        if(elem) elem.innerHTML = tbdy;
    }

    function formSubmit(formData: FormData){
        
        formData.set('accounts', JSON.stringify(myAccs));

        createIndividualCustomerUtil(formData)
        .then(resp => {
            console.log(resp);
            
            if(resp?.message){
                showToast(resp.message, 'error');
                setMyAccs([]);
                return;
            }
            else if(resp?.error){
                showToast(resp.error + `(${resp.status})`, 'error');
                setMyAccs([]);
                return;
            }

            showToast('Customer created successfully.', 'success');

            setMyAccs([]);

            router.push('/dashboard/customers/individuals');

        })
        .catch(err => {
            console.log(err);
            showToast('Failed to create individual customer.', 'error');
        })
        
        
    }
    

    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">New Individual Customer</h4>
                <Link href="/dashboard/customers/individuals" className="button p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back to List
                </Link>
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <form action={formSubmit}>
                    <div className="card-body">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input1">Name</label>
                                    <input name="name" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input1" placeholder="Name" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input2">Email</label>
                                    <input name="email" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="email" id="input2" placeholder="Email" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input3">Phone Number</label>
                                    <input name="phone" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input3" placeholder="Number" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input4">National ID</label>
                                    <input name="national" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input4" placeholder="National ID" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input5">Address</label>
                                    <input name="address" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input5" placeholder="Address" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input6">Approvers per Transaction</label>
                                    <input name="reqApprovers" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="number" id="input6" placeholder="1" required/>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mt-4">
                                    <div className="flex m-0 justify-between">
                                        <h5 className="">Account(s) Details</h5>
                                        <span className="text-blue-500 cursor-pointer" onClick={() => openModal('modal-addAcc')}>
                                            <i className="fa-solid fa-plus-circle mr-1"></i>add
                                        </span>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mb-4">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-sm text-gray-700 bg-gray-100">
                                            <tr className="">
                                                <th scope="col" className="px-6 py-3">
                                                    Account Type
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Account Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    AccountNumber
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="mytbody"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="my-4">
                                    <h5>Login Credentials</h5>
                                    <hr />
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input7">Username</label>
                                    <input name="username" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input7" placeholder="Username" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 xl:col-span-4">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input8">Password</label>
                                    <input name="pwd" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="password" id="input8" placeholder="Password" required/>
                                </div>
                            </div>
                        </div>
                        <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50 mt-5">
                            <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                Submit
                                <i className="fa-regular fa-check-circle ml-2 mt-1"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            <AccountForm myFunc={addAccDetail}></AccountForm>
            

        </main>
    );
}