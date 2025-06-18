'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {axiosClient} from "@/endpoints/api";
import Image from "next/image";
import {showToast} from "@/shared/utilities/commons";
import {setSessionData} from "@/shared/repositories/storage-repository";

export default function Data() {

    const [products,  setProducts] = useState<any>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        //get customers
        axiosClient.get(`v1/products/products-list-category/ELECTRICITY`)
            .then((res:any) =>{
                // _isMounted.current = false;
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err:any) => {

                showToast("Failed to fetch products", 'error');
            });

    }, []);




    return (

        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Buy ZESA TOKEN</h4>

            </div>

            <h4 className="text-[18px] font-medium text-gray-800 text-center mb-sm-0 grow mb-2 mt-8 md:mb-0">Electricity  Tokens</h4>
            <hr/>
            <div className="grid grid-cols-2 gap-4 mt-6 mb-4">
                {products?.map((product: any) => (
                    <div className="card p-5 rounded-2xl border-2 border-cyan-500" key={product?.id}>
                        <div className="card-body">
                            <div className="grid grid-cols-1 mb-4">
                                <div className="text-right pt-2">
                                    <h4 className="text-gray-800 text-center m-3">{product?.description}</h4>
                                    <p className="text-gray-800 text-center m-3">buy <b className="text-blue-800">{product?.currency}</b> tokens</p>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br/>
            <br/>

        </main>

    );
}