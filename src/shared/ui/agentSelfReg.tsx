/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { closeModal, openModal, showToast } from "../utilities/commons";
import { individualCustomerRegistrationUtil } from "../utilities/utils";
import AccountForm from "./accountForm";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginAxiosClient} from "@/endpoints/loginApi";
import {useRouter} from "next/navigation";

const createCustomerValidationSchema = Yup.object({
    customerName: Yup.string().required('customer name required'),
    email: Yup.string().email("invalid email").required('email required'),
    address: Yup.string().required('address required'),
    phoneNumber:Yup.string()
        .min(9, 'Phone number must have at least 9 digits').max(12, 'Mobile number cannot exceed 12 digits')
        .matches(/^\d+$/, 'Phone number must contain only digits').required('phone number required'),
    nationalId: Yup.string().required('nationalId required'),
    numberOfRequiredApproversPerTransaction: Yup.string().required('Approvers required'),

});

export default function AgentSelfRegister() {

    const [myAccs, setMyAccs] = useState<any[]>([]);
    const router = useRouter();
    let myModeCount = 1;
    const myModeTitles = [
        'Tell us your name.',
        'Let us update your contact details.', 'What is your approval level?',
        'All set. Click Save.'
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

    const createAgentForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

            const payload =  {

                customerName: values.customerName,
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
                    await router.push('/login');

                } else {
                    showToast('Failed to create agent', 'error');
                }
            }catch(err:any){
                showToast('Failed to create agent', 'error');

            }
        },

        initialValues: {
            customerName: '',
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
                                               htmlFor="input1">Full Name</label>
                                        <input name="customerName"
                                               className={`w-full placeholder:text-xs border rounded-md border-gray-200 p-2 ${
                                                   createAgentForm.errors.customerName && createAgentForm.touched.customerName
                                                       ? "border-red-500"
                                                       : "border-gray-300"
                                               }`}
                                               type="text" id="customerName" placeholder="John Doe" required
                                               onChange={createAgentForm.handleChange}
                                               onBlur={createAgentForm.handleBlur}
                                               value={createAgentForm.values.customerName}/>
                                        {createAgentForm.errors.customerName && createAgentForm.touched.customerName && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{createAgentForm.errors.customerName}</div>
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