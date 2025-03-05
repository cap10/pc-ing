/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { individualCustomerRegistrationUtil } from "../utilities/utils";
import AccountForm from "./accountForm";

export default function IndividualSelfRegister() {
    
    const [myAccs, setMyAccs] = useState<any[]>([]);
    let myModeCount = 1;
    const myModeTitles = [
        'Tell us your name.', 'What is your National Identity Number?',
        'Let us update your contact details.', 'What is your approval level?',
        'Add your account details.', 'Create your account login details.', 'All set. Click Save.'
    ];
    
    function formSubmit(formData: FormData){

        // console.log(formData);
        
            
        formData.set('accounts', JSON.stringify(myAccs));

        individualCustomerRegistrationUtil(formData)
        .then(resp => {
            // console.log(resp);
            
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

            showToast('Customer registered successfully. Check your email.', 'success');

            setMyAccs([]);

            // router.push('/dashboard/customers/individuals');
            setTimeout("document.location.href = '/';", 2000)
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to register customer.', 'error');
        })
        
        
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

    function showNextArea(){

        const areaHide = document.getElementById('area-' + myModeCount);

        const theTxt = document.getElementById('theText');
        if(theTxt) theTxt.innerHTML = myModeTitles[myModeCount];

        myModeCount += 1;

        const areaShow = document.getElementById('area-' + myModeCount);

        if(areaHide) areaHide.style.display = 'none';
        if(areaShow) areaShow.style.display = 'block';

        if(myModeCount == 7){
            const areaNxt= document.getElementById('areaNxt');

            if(areaNxt) areaNxt.style.display = 'none';
        }
    }

    return (
        <div>
            <hr />
            <section className="mt-5 pt-4">
                <form action={formSubmit}>
                    <div className="card-body">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12">
                                <div className="">
                                    <h5 id="theText" className="text-black font-bold">{myModeTitles[0]}</h5>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-1">
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input1">Name</label>
                                    <input name="name" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input1" placeholder="Name" required/>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-2" style={{display: 'none'}}>
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input04">National ID</label>
                                    <input name="national" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input04" placeholder="National ID" required/>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-3" style={{display: 'none'}}>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input2">Email</label>
                                        <input name="email" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="email" id="input2" placeholder="Email" required/>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input3">Phone Number</label>
                                        <input name="phone" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input3" placeholder="Number" required/>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input5">Address</label>
                                        <input name="address" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input5" placeholder="Address" required/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-4" style={{display: 'none'}}>
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-600" htmlFor="input6">Approvers per Transaction</label>
                                    <input name="reqApprovers" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="number" id="input6" placeholder="1" required/>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-5" style={{display: 'none'}}>
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
                                            <tbody id="mytbody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12" id="area-6" style={{display: 'none'}}>
                                <div className="col-span-12">
                                    <div className="my-4">
                                        <h5>Login Credentials</h5>
                                        <hr />
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input7">Username</label>
                                        <input name="username" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="text" id="input7" placeholder="Username" required/>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input8">Password</label>
                                        <input name="pwd" className="w-full placeholder:text-xs border rounded-md border-gray-200 p-2" type="password" id="input8" placeholder="Password" required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="area-7" className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50 mt-5" style={{display: 'none'}}>
                            <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                Save
                                <i className="fa-regular fa-check-circle ml-2 mt-1"></i>
                            </button>
                        </div>
                        <div id="areaNxt" className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50 mt-5">
                            <button onClick={showNextArea} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                Next
                                <i className="fa-solid fa-forward ml-2 mt-1"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            <AccountForm myFunc={addAccDetail}></AccountForm>
        </div>
    );
}