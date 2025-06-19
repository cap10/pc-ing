'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import {ShieldCheckIcon} from "@heroicons/react/16/solid";
import {useFormik} from "formik";
import {generateRandomString} from "../../random-generator";
import * as Yup from "yup";

const preAuthValidationSchema = Yup.object({
    customerMobile: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(9, 'Phone number must have at least 9 digits')
        .max(12, 'Mobile number cannot exceed 12 digits')
        .required('Customer mobile required'),

});

export default function Data() {

    const [products,  setProducts] = useState<any>([]);
    const [econetData,  setEconetData] = useState<any>(null);
    const [requestId,  setRequestId] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        //get customers
        axiosClient.get(`v1/products/products-list-category/DATA`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err:any) => {

                showToast("Failed to fetch products", 'error');
            });

    }, []);

    //Display active sites only
    let EconetData: any[] = [];
    let NetoneData: any[] = [];
    let TelecelData: any[] = [];
    products.forEach(function(product){

        if (product?.name?.toLowerCase()?.includes("econet")) {
            EconetData.push(product);
        }
        if (product?.name?.toLowerCase()?.includes("netone")){
            NetoneData.push(product);
        }
        if (product?.name?.toLowerCase()?.includes("zol")){
            TelecelData.push(product);
        }

    });

    const openBuyDataModal = (product:any)  => {
        setOpen(true);
        setEconetData(product)
    }

    const preAuthForm = useFormik({
        async onSubmit<Values>(values: any, {resetForm, setErrors}: any) {

            const randomString = generateRandomString();
            setRequestId(randomString);

            const payload =  {
                amount: econetData?.productPrice,
                productId: econetData?.id,
                requestId: randomString,
                customerMobile: values.customerMobile,
            }

            try {

                const {data}  =  await axiosClient.post(`v1/transactions/bill-payment/pre-auth`, payload);

                if (data?.preAuthToken != null) {
                    setPreAuthToken(data?.preAuthToken);

                } else {
                    showToast("Data Purchase failed", 'error');
                }
            }catch(err:any){
                showToast(err?.response?.data?.message, 'error');

            }
        },

        initialValues: {
            customerMobile: '',
        },
        validationSchema: preAuthValidationSchema,
    });


     return (
         <main>
             <div
                 className="flex items-center justify-between px-2 mb-6 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
                 <div className="flex items-center space-x-3">
                     {/* Data Icon */}
                     <div className="p-2 bg-blue-50 rounded-full">
                         <svg
                             className="w-5 h-5 text-cyan-400"
                             fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor"
                         >
                             <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                             />
                         </svg>
                     </div>

                     {/* Heading */}
                     <h4 className="text-xl font-semibold text-gray-800">
      <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Buy Data
      </span>
                     </h4>
                 </div>

                 {/* Optional action button */}
                 <button
                     className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                     </svg>
                     New Bundle
                 </button>
             </div>

             <Dialog open={open} onClose={setOpen} className="relative z-10">
                 <DialogBackdrop
                     transition
                     className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                 />

                 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                         <DialogPanel
                             transition
                             className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                         >
                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                 <div className="sm:flex sm:items-start">
                                     <div
                                         className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-100 sm:mx-0 sm:size-10">
                                         <ShieldCheckIcon aria-hidden="true" className="size-6 text-cyan-400"/>
                                     </div>
                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                         <DialogTitle as="h3"
                                                      className="text-base text-center font-semibold text-gray-900 mb-6">
                                             Purchase {econetData?.name.split(' ')[0].charAt(0).toUpperCase() + econetData?.name.split(' ')[0].slice(1)} Data
                                         </DialogTitle>
                                         <hr/>
                                         <div className="mt-4 mb-3">
                                             <p className="text-sm text-gray-500">
                                                 Are you sure you want to buy data
                                                 for <b
                                                 className="text-gray-700">{econetData?.currency} {econetData?.productPrice}</b>
                                             </p>
                                         </div>

                                         <form onSubmit={preAuthForm.handleSubmit}>

                                             <div className="mb-4 mt-4">
                                                 <label className="block mb-2 font-medium text-gray-600">Customer Mobile
                                                 </label>
                                                 <input
                                                     name="customerMobile"
                                                     className={`w-full px-3 py-2 placeholder:text-xs border rounded-md ${
                                                         preAuthForm.errors.customerMobile && preAuthForm.touched.customerMobile
                                                             ? "border-red-500"
                                                             : "border-gray-300"
                                                     }`}
                                                     type="text"
                                                     placeholder="0777777777"
                                                     required
                                                     onChange={preAuthForm.handleChange}
                                                     onBlur={preAuthForm.handleBlur}
                                                     value={preAuthForm.values.customerMobile}
                                                 />
                                                 {preAuthForm.errors.customerMobile && preAuthForm.touched.customerMobile && (
                                                     <div className="text-red-500 text-sm mt-1">
                                                         {preAuthForm.errors.customerMobile}
                                                     </div>
                                                 )}
                                             </div>

                                             <div
                                                 className="bg-gray-50 mt-4 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                 <button
                                                     className="inline-flex w-full justify-center rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-300 sm:ml-3 sm:w-auto"
                                                     disabled={preAuthForm.isSubmitting}
                                                     type="submit"
                                                 >
                                                     {preAuthForm.isSubmitting ? "Processing..." : "Buy Data"}

                                                 </button>
                                                 <button
                                                     type="button"
                                                     data-autofocus
                                                     onClick={() => setOpen(false)}
                                                     className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                 >
                                                     Cancel
                                                 </button>
                                             </div>
                                         </form>
                                     </div>
                                 </div>
                             </div>

                         </DialogPanel>
                     </div>
                 </div>
             </Dialog>

             <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Enhanced Header */}
                 <div className="text-center mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                        Econet
                      </span>
                         <span className="text-gray-700"> Data Bundles</span>
                     </h2>
                     <div
                         className="mt-4 h-1 w-40 bg-gradient-to-r from-blue-600 to-cyan-300 mx-auto rounded-full">

                     </div>
                 </div>

                 {/* Grid Layout */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {EconetData?.map((product) => (
                         <div key={product?.id} className="flex justify-center">
                             {/* Card Container */}
                             <div
                                 className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">

                                 {/* Image Section */}
                                 <div
                                     className="relative h-40 bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-6">
                                     <div className="transition-transform duration-500 hover:scale-95">
                                         <Image
                                             width={220}
                                             height={60}
                                             src="/images/econet1.png"
                                             alt="Econet Logo"
                                             className="object-contain h-16 mx-auto"
                                         />
                                     </div>
                                 </div>

                                 {/* Content Section */}
                                 <div className="p-5">
                                     <div className="flex justify-between items-start">
                                         <h3 className="text-lg font-bold text-gray-500 truncate">
                                             {product?.description.split(' ').pop()} Data
                                         </h3>
                                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product?.validity || '30 days'}
              </span>
                                     </div>

                                     <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                         {product?.description}
                                     </p>

                                     {/* Price and CTA */}
                                     <div className="mt-5 flex items-center justify-between">
                                         <div>
                                             <span className="text-gray-700 text-sm">Price</span>
                                             <p className="text-md font-bold text-blue-500">
                                                 {product?.currency} {product?.productPrice}
                                             </p>
                                         </div>
                                         <button
                                             onClick={() => openBuyDataModal(product)}
                                             className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-300 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-sm"
                                         >
                                             Buy Now
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             <br/>
             <br/>

             <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Enhanced Header */}
                 <div className="text-center mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      <span className="bg-gradient-to-r from-orange-600 to-orange-300 bg-clip-text text-transparent">
                        Netone
                      </span>
                         <span className="text-gray-700"> Data Bundles</span>
                     </h2>
                     <div className="mt-4 h-1 w-40 bg-gradient-to-r from-orange-500 to-orange-200 mx-auto rounded-full">
                     </div>
                 </div>

                 {/* Grid Layout */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {NetoneData?.map((product) => (
                         <div key={product?.id} className="flex justify-center">
                             {/* Card Container */}
                             <div
                                 className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">

                                 {/* Image Section */}
                                 <div
                                     className="relative h-40 bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-6">
                                     <div className="transition-transform duration-500 hover:scale-95">
                                         <Image
                                             width={220}
                                             height={60}
                                             src="/images/netone1.png"
                                             alt="Econet Logo"
                                             className="object-contain h-16 mx-auto"
                                         />
                                     </div>
                                 </div>

                                 {/* Content Section */}
                                 <div className="p-5">
                                     <div className="flex justify-between items-start">
                                         <h3 className="text-lg font-bold text-gray-500 truncate">
                                             {product?.description.split(' ').pop()} Data
                                         </h3>
                                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product?.validity || '30 days'}
              </span>
                                     </div>

                                     <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                         {product?.description}
                                     </p>

                                     {/* Price and CTA */}
                                     <div className="mt-5 flex items-center justify-between">
                                         <div>
                                             <span className="text-gray-700 text-sm">Price</span>
                                             <p className="text-md font-bold text-blue-500">
                                                 {product?.currency} {product?.productPrice}
                                             </p>
                                         </div>
                                         <button
                                             onClick={() => openBuyDataModal(product)}
                                             className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-300 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-sm"
                                         >
                                             Buy Now
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             <br/>
             <br/>

             <div className="max-w-screen-xl mx-auto px-1 sm:px-6 lg:px-4 py-8">
                 {/* Enhanced Header */}
                     {/* Enhanced Header */}
                     <div className="text-center mb-8">
                         <h2 className="text-3xl md:text-4xl font-bold mb-3">
                              <span className="bg-gradient-to-r from-red-700 to-red-400 bg-clip-text text-transparent">
                                Telecel
                              </span>
                             <span className="text-gray-700"> Data Bundles</span>
                         </h2>
                         <div className="mt-4 h-1 w-40 bg-gradient-to-r from-red-700 to-red-300 mx-auto rounded-full"></div>
                     </div>

                 {/* Grid Layout */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {NetoneData?.map((product) => (
                         <div key={product?.id} className="flex justify-center">
                             {/* Card Container */}
                             <div
                                 className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">

                                 {/* Image Section */}
                                 <div
                                     className="relative h-40 bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-6">
                                     <div className="transition-transform duration-500 hover:scale-95">
                                         <Image
                                             width={220}
                                             height={60}
                                             src="/images/telecel1.png"
                                             alt="Econet Logo"
                                             className="object-contain h-16 mx-auto"
                                         />
                                     </div>
                                 </div>

                                 {/* Content Section */}
                                 <div className="p-5">
                                     <div className="flex justify-between items-start">
                                         <h3 className="text-lg font-bold text-gray-500 truncate">
                                             {product?.description.split(' ').pop()} Data
                                         </h3>
                                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product?.validity || '30 days'}
              </span>
                                     </div>

                                     <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                         {product?.description}
                                     </p>

                                     {/* Price and CTA */}
                                     <div className="mt-5 flex items-center justify-between">
                                         <div>
                                             <span className="text-gray-700 text-sm">Price</span>
                                             <p className="text-md font-bold text-blue-500">
                                                 {product?.currency} {product?.productPrice}
                                             </p>
                                         </div>
                                         <button
                                             onClick={() => openBuyDataModal(product)}
                                             className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-300 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-sm"
                                         >
                                             Buy Now
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             <br/>
             <br/>

         </main>
     );
}