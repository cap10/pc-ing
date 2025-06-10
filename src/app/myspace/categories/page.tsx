'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";

export default function Categories() {

    const [categories,  setCategories] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    let customerId:any;

    if ( typeof window !== 'undefined') {
        // Perform localStorage action
        customerId = localStorage.getItem('organisationId');
    }

    useEffect(() => {
        //get customers
        axiosClient.get(`v1/products/categories`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setCategories(res.data);
                setLoading(false);
            })
            .catch((err:any) => {
                setLoading(false);
                showToast("Failed to fetch categories", 'error');
            });

    }, []);

    return (

        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Categories</h4>{/*
                <Link href={'/myspace/transfers'} type="button" className="p-1 text-white bg-color-primary rounded-md">Categories
                    Money</Link>*/}
            </div>

            <section className="mt-5 pt-4">
                <h4 className="font-bold">Categories List</h4>
                <div className="mt-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                        <tr className="">
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </section>

        </main>

    );
}