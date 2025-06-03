/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { createCorporateCustomerUtil } from "../utilities/utils";
import UserRightsForm from "./userRightsForm";
import * as Yup from "yup";
import {useFormik} from "formik";
import {loginAxiosClient} from "@/endpoints/loginApi";

const createCustomerValidationSchema = Yup.object({
    companyName: Yup.string().required('company name required'),
    email: Yup.string().email("invalid email").required('email required'),
    address: Yup.string().required('address required'),
    phoneNumber:Yup.string()
        .min(9, 'Phone number must have at least 9 digits').max(12, 'Mobile number cannot exceed 12 digits')
        .matches(/^\d+$/, 'Phone number must contain only digits').required('phone number required'),
    nationalId: Yup.string().required('nationalId required'),
    numberOfRequiredApproversPerTransaction: Yup.string().required('Approvers required'),

});

export default function CorporateSelfRegister() {
    
    const [myAccs2, setMyAccs2] = useState<any[]>([]);
    const [myUsers, setMyUsers] = useState<any[]>([]);
    let myModeCount = 1;
    const myModeTitles = [
        'Tell us your company name.', 'What are your registration details?',
        'Let us update your contact details.', 'What is your approval level?',
        'Add your account details.', 'Create your account login details.', 'All set. Click Save.'
    ];

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

    function showNextArea(){

        

        const areaHide = document.getElementById('area-1' + myModeCount);

        console.log('hey', areaHide);
        const theTxt = document.getElementById('theText1');
        if(theTxt) theTxt.innerHTML = myModeTitles[myModeCount];

        myModeCount += 1;

        const areaShow = document.getElementById('area-1' + myModeCount);

        if(areaHide) areaHide.style.display = 'none';
        if(areaShow) areaShow.style.display = 'block';

        if(myModeCount == 7){
            const areaNxt= document.getElementById('areaNxt1');

            if(areaNxt) areaNxt.style.display = 'none';
        }
    }

    const createAgentForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

            const payload =  {

                companyName: values.companyName,
                email: values.email,
                address: values.address,
                phoneNumber: values.phoneNumber,
                nationalId: values.nationalId,
                numberOfRequiredApproversPerTransaction: values.numberOfRequiredApproversPerTransaction,
                accounts:[
                    {
                        accountType: "AGENT",
                        description: values.description,
                    }
                ]
            }

            try {

                const {data}  =  await loginAxiosClient.post(`v1/individual-customers`, payload);

                if (data != null) {
                    showToast('Agent created successfully.visit your email for account activation', 'success');

                } else {
                    showToast('Failed to create agent', 'error');
                }
            }catch(err:any){
                showToast('Failed to create agent', 'error');

            }
        },

        initialValues: {
            companyName: '',
            email: '',
            address:  '',
            phoneNumber:  '',
            nationalId:  '',
            numberOfRequiredApproversPerTransaction:  '',
        },
        validationSchema: createCustomerValidationSchema,
    });


    return (
        <div>
            <hr/>
            <section className="mt-5 pt-4">
                <form onSubmit={createAgentForm.handleSubmit}>
                    <div className="card-body">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12">
                                <div className="">
                                    <h5 id="theText" className="text-black font-bold">Create your Account</h5>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">Company Name</label>
                                        <input name="companyName"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.companyName && createAgentForm.touched.companyName
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="companyName" placeholder="John Doe" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.companyName}/>
                                        {createAgentForm.errors.companyName && createAgentForm.touched.companyName && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.companyName}</div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">Email</label>
                                        <input name="email"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.email && createAgentForm.touched.email
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="email" id="email" placeholder="customer@gmail.com" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.email}/>
                                        {createAgentForm.errors.email && createAgentForm.touched.email && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.email}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">Phone Number</label>
                                        <input name="phoneNumber"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.phoneNumber && createAgentForm.touched.phoneNumber
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="phoneNumber" placeholder="0777777777" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.phoneNumber}/>
                                        {createAgentForm.errors.phoneNumber && createAgentForm.touched.phoneNumber && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.phoneNumber}</div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">National ID</label>
                                        <input name="nationalId"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.nationalId && createAgentForm.touched.nationalId
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="nationalId" placeholder="23-345455X45" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.nationalId}/>
                                        {createAgentForm.errors.nationalId && createAgentForm.touched.nationalId && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.nationalId}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">No. of Approvers</label>
                                        <input name="numberOfRequiredApproversPerTransaction"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.numberOfRequiredApproversPerTransaction && createAgentForm.touched.numberOfRequiredApproversPerTransaction
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="number" id="numberOfRequiredApproversPerTransaction"
                                               placeholder="0" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.numberOfRequiredApproversPerTransaction}/>
                                        {createAgentForm.errors.numberOfRequiredApproversPerTransaction && createAgentForm.touched.numberOfRequiredApproversPerTransaction && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.numberOfRequiredApproversPerTransaction}</div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600"
                                               htmlFor="input1">Address</label>
                                        <input name="address"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.address && createAgentForm.touched.address
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="address" placeholder="23 R Mugabe,  Harare" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.address}/>
                                        {createAgentForm.errors.address && createAgentForm.touched.address && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.address}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <button
                                        className="w-full py-2 text-white bg-blue-600 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
                                        disabled={createAgentForm.isSubmitting}
                                        type="submit"
                                    >
                                        {createAgentForm.isSubmitting ? "Processing..." : "Submit"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}