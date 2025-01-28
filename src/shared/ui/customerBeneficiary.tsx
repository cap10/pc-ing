import { useEffect, useState } from "react";
import { createBeneficiary, deleteBeneficiary, getActiveBanks, getCustomerAccounts, getCustomerBeneficiaries, updateBeneficiary } from "../services/main-service";
import { closeModal, openModal, showToast } from "../utilities/commons";

export default function CustomerBeneficiaries({custRef}:{custRef: string}) {
    
    const [beneficiaries, setBeneficiaries] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [banks, setBanks] = useState(null);
    let beneReference = '';
    
    function getBeneficiaries(){
        // console.log(custId);
        if(!custRef){
            // showToast('No customer reference found.', 'error');
            return;
        }
        
        getCustomerBeneficiaries(custRef)
        .then((data) => {
            // console.log(data);
            
            setBeneficiaries(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get Customer beneficiaries.', 'error');
        })
    }

    function confirmBene(ref: string, modal: string, mode: string){
        if(ref){
            beneReference = ref;

            if(mode == 'edit'){
                beneficiaries.forEach(r => {
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

    function deleteBene(){
        if(beneReference){

            deleteBeneficiary(beneReference)
                .then((resp) => {
                    // console.log(resp);

                    if(resp.error){
                        showToast(resp.error + ': ' + resp.status, 'error');
                        
                        return;
                    }

                    showToast('Beneficiary has been deleted.', 'success');
                    getBeneficiaries();
                    closeModal('modal-beneDelete');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Failed to delete beneficiary.', 'error');
                });
        }
        else{
            showToast('No beneficiary reference found.', 'error');
        }
    } 

    function updateBeneDetail(formData: FormData){
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
            
            updateBeneficiary(beneReference, rec)
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
    
                showToast('Beneficiary updated successfully.', 'success');
    
                getBeneficiaries();
    
                closeModal('modal-editBene');
    
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to update customer beneficiary.', 'error');
            })
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    function getBanks(){
        getActiveBanks()
        .then(data => {
            // console.log(data);
            
            setBanks(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get active banks.', 'error');
        })
    }

    function getAccounts(){
        getCustomerAccounts(custRef)
        .then(data => {
            // console.log(data);
            
            setAccounts(data);
        })
        .catch(err => {
            console.log(err);
            showToast('Failed to get customer accounts.', 'error');
        })
    }

    function createBene(formData: FormData){
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
            
            createBeneficiary(rec)
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
    
                showToast('Beneficiary created successfully.', 'success');
    
                getBeneficiaries();
    
                closeModal('modal-addBene');
    
            })
            .catch(err => {
                console.log(err);
                showToast('Failed to add beneficiary.', 'error');
            })
        }
        else{
            showToast('All fields are required.', 'error');
        }
    }

    useEffect(() => {
        getBeneficiaries();
        getBanks();
        getAccounts();
    }, []);

    return (
        <section>
            <div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-gray-900">Customer Beneficiaries</h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-dgray-500">{custRef}</p>
                </div>
                {
                    beneficiaries ? (
                        <section>
                            <div className="mt-6 border-t border-gray-100">
                                <div className="mt-2 text-right">
                                    <span className="mr-3 text-color-secondary font-bold cursor-pointer text-sm" onClick={() => {openModal('modal-addBene')}}>
                                        <i  className="fa-solid fa-plus mr-1"></i> Add
                                    </span>
                                </div>
                                <div className="mt-5 overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-sm text-gray-700 bg-gray-200">
                                            <tr className="">
                                                <th scope="col" className="px-6 py-3">
                                                    Beneficiary Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Beneficiary Account
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Bank
                                                </th>
                                                <th scope="col" className="px-6 py-3">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {beneficiaries?.map((u: any) => (
                                                <tr className="bg-white border border-gray-200" key={u.id}>
                                                    <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                                        {u.beneficiaryName}
                                                    </th>
                                                    <td className="px-6 py-3.5">
                                                        {u.accountNumber}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.bank?.bankName}
                                                    </td>
                                                    <td className="text-center">
                                                        <span title="Edit Beneficiary" onClick={() => {confirmBene(u.id, 'modal-editBene', 'edit')}} className="text-yellow-500 px-1 py-0.5 cursor-pointer"><i className="fa-solid fa-edit"></i></span>
                                                        <span title="Delete Beneficiary" onClick={() => {confirmBene(u.id, 'modal-beneDelete', 'delete')}} className="text-red-500 px-1 py-0.5 cursor-pointer"><i className="fa-regular fa-trash-alt"></i></span>
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

            <div className="relative z-50 hidden modal" id="modal-beneDelete" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Delete Beneficiary
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4 text-center">
                                        <h4 className="font-semibold">You are about to delete a beneficiary.</h4>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-beneDelete')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => {deleteBene()}} className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Proceed
                                        <i className="fa-solid fa-arrow-right ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-50 hidden modal" id="modal-addBene" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <form action={createBene}>
                                <div className="bg-white">
                                    <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 ">
                                            Add Customer Beneficiary
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input31">Customer Account</label>
                                            <select name="account" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input31" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                {accounts?.map((u: any) => (
                                                    <option value={u.accountNumber} key={u.id}>{`${u.accountNumber} (${u.accountType})`}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input30">Bank</label>
                                            <select name="bank" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input30" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                {banks?.map((u: any) => (
                                                    <option value={u.id} key={u.id}>{u.bankName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input10">Beneficiary Name</label>
                                            <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input10" placeholder="name" required/>
                                        </div>
                                    </div>
                                    <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                        <button onClick={() => closeModal('modal-addBene')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                            <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                            Cancel
                                        </button>
                                        <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                            Add
                                            <i className="fa-regular fa-save ml-2 mt-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-50 hidden modal" id="modal-editBene" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                    <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                            <form action={updateBeneDetail}>
                                <div className="bg-white">
                                    <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 ">
                                            Update Beneficiary Details
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input1">Customer Account</label>
                                            <select name="account" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input1" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                {accounts?.map((u: any) => (
                                                    <option value={u.accountNumber} key={u.id}>{`${u.accountNumber} (${u.accountType})`}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input2">Bank</label>
                                            <select name="bank" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input2" required>
                                                <option value="" defaultValue={""}>select...</option>
                                                {banks?.map((u: any) => (
                                                    <option value={u.id} key={u.id}>{u.bankName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium text-gray-600" htmlFor="input3">Beneficiary Name</label>
                                            <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input3" placeholder="name" required/>
                                        </div>
                                    </div>
                                    <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                        <button onClick={() => closeModal('modal-editBene')} type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
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