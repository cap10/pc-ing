'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";

export default function Categories() {

    const [categories,  setCategories] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const page = 0;
    const size = 100;

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
                <Link href={'/myspace/transfers'} type="button" className="p-1 text-white bg-color-primary rounded-md">Products
                    Money</Link>*/}
            </div>

            <section className="mt-5 pt-4">
                <h4 className="font-bold mb-4">Categories List</h4>

                <div className="grid grid-cols-3 gap-4 mb-4">

                    {
                        categories?.map((category: any) => (
                            <div className="card p-5 border-2 rounded-2xl border-cyan-500" key={category?.id}>
                                <div className="card-body">
                                    <div className="grid grid-cols-2 mb-4">
                                        <div>
                                            <h1 className="text-center"> {category?.category}</h1>
                                        </div>
                                        <br/>
                                        <div>
                                            <Image width={400} height={600} src={category?.logo} alt=""
                                                   className="inline-block w-5 align-middle" id="mini-logo"/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </section>

        </main>

    );
}