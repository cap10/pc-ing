/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { createCorporateCustomerUtil } from "../utilities/utils";
import UserRightsForm from "./userRightsForm";

export default function CorporateSelfRegister() {
    
    const [myAccs2, setMyAccs2] = useState<any[]>([]);
    const [myUsers, setMyUsers] = useState<any[]>([]);

    function addAccDetail2(formData: FormData){
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

            
            myAccs2.push(rec);
            setMyAccs2(myAccs2);
            
            renderData(myAccs2);

            closeModal('modal-addAcc2');
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

        const elem = document.getElementById('mytbody3');
        if(elem) elem.innerHTML = tbdy;
    }

    function formSubmit(formData: FormData){
        
        formData.set('accounts', JSON.stringify(myAccs2));
        formData.set('users', JSON.stringify(myUsers));

        createCorporateCustomerUtil(formData)
        .then(resp => {
            console.log(resp);
            
            if(resp?.message){
                showToast(resp.message, 'error');
                setMyAccs2([]);
                return;
            }
            else if(resp?.error){
                showToast(resp.error + `(${resp.status})`, 'error');
                setMyAccs2([]);
                return;
            }

            showToast('Customer registered successfully. Check your email.', 'success');

            setMyAccs2([]);

            // router.push('/dashboard/customers/corporates');
            setTimeout("document.location.href = '/';", 2000)

        })
        .catch(err => {
            console.log(err);
            showToast('Failed to register corporate customer.', 'error');
        })
        
        
    }
    
    function addUserDetail(formData: FormData){
        const name = formData?.get('name')?.toString();
        const email = formData?.get('email')?.toString();
        const natid = formData?.get('nationalId')?.toString();
        const number = formData?.get('phone')?.toString();
        const role = formData?.get('role')?.toString();

        if(name && number && role && email && natid){
            // console.log(name, number, typ);
            
            const rec = {
                "phoneNumber": number,
                "email": email,
                "nationalId": natid,
                "userRight": role,
                "name": name
            };        

            
            myUsers.push(rec);
            setMyUsers(myUsers);
            
            renderData2(myUsers);

            closeModal('modal-addUser');
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    function renderData2(data: any[]){
        let tbdy = '';
        if(data){
            data.forEach((u: any) => {
                tbdy += `
                    <tr style="border: 1px solid rgb(229 231 235);">
                        <th scope="row" style="padding: 0.3rem 3rem;" className="font-medium text-gray-900 whitespace-nowrap">
                            ${u.name}
                        </th>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.email}
                        </td>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.nationalId}
                        </td>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.phoneNumber}
                        </td>
                        <td style="padding: 0.3rem 3rem;">
                            ${u.userRight}
                        </td>
                    </tr>
                `
            });
        }

        const elem = document.getElementById('mytbody2');
        if(elem) elem.innerHTML = tbdy;
    }

    return (
        <div>
            <hr />
            <section className="mt-5 pt-4">
                <form action={formSubmit}>
                    <div className="card-body">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input31">Name</label>
                                    <input name="name" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input31" placeholder="Name" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input9">Incorporation Date</label>
                                    <input name="incoDate" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="date" id="input9" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input4">Registration Number</label>
                                    <input name="regNumber" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input4" placeholder="Registration Number" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input32">Email</label>
                                    <input name="email" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="email" id="input32" placeholder="Email" required/>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input33">Phone Number</label>
                                    <input name="phone" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input33" placeholder="Number" required/>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input35">Address</label>
                                    <input name="address" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input35" placeholder="Address" required/>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input36">Approvers per Transaction</label>
                                    <input name="reqApprovers" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="number" id="input36" placeholder="1" required/>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mt-4">
                                    <div className="flex m-0 justify-between">
                                        <h5 className="">Account(s) Details</h5>
                                        <span className="text-blue-500 cursor-pointer" onClick={() => openModal('modal-addAcc2')}>
                                            <i className="fa-solid fa-plus-circle mr-1"></i>add
                                        </span>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mb-4 overflow-x-auto">
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
                                        <tbody id="mytbody3"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mt-4">                                    
                                    <div className="flex m-0 justify-between">
                                        <h5>Users Login Credentials</h5>
                                        <span className="text-blue-500 cursor-pointer" onClick={() => openModal('modal-addUser')}>
                                            <i className="fa-solid fa-plus-circle mr-1"></i>add
                                        </span>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="mb-4 overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-sm text-gray-700 bg-gray-100">
                                            <tr className="">
                                                <th scope="col" className="px-6 py-3">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    National ID
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Phone
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Rights
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="mytbody2"></tbody>
                                    </table>
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

            {/* <AccountForm myFunc={addAccDetail}></AccountForm> */}
            <div className="relative z-50 hidden modal" id="modal-addAcc2" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <form action={addAccDetail2}>
                                <div className="bg-white">
                                    <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 ">
                                            Add Account Detail
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input130">Account Type</label>
                                            <select name="typ" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input130" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                <option value="CURRENT">Current</option>
                                                <option value="DEPOSIT">Deposit</option>
                                                <option value="SAVINGS">Savings</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input110">Account Name</label>
                                            <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input110" placeholder="name" required/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input120">Account Number</label>
                                            <input name="number" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input120" placeholder="number" required/>
                                        </div>
                                    </div>
                                    <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                        <button onClick={() => closeModal('modal-addAcc2')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                            <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                            Cancel
                                        </button>
                                        <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                            Add
                                            <i className="fa-regular fa-check-circle ml-2 mt-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <UserRightsForm myFunc={addUserDetail} enableUsername={false}></UserRightsForm>
        </div>
    );
}