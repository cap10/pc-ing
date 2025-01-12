import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Home',
};

export default function Home() {

    return (
        
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Dashboard</h4>
                <Link href={'/myspace/transfers'} type="button" className="p-1 text-white bg-color-primary rounded-md">Transfer Money</Link>
            </div>

            <div className="grid grid-cols-3 gap-4">

                <div className="card p-5 border-2 rounded-2xl border-blue-700">
                    <div className="card-body">
                        <h4 className="font-bold">Current Account ZWL</h4>
                        <h6 className="text-gray-500">6837363822</h6>
                        <div className="mt-5">
                            <span className="text-gray-500">ZWL</span>
                            <span className="font-bold ml-2">6852.14</span>
                        </div>
                    </div>
                </div>

                <div className="card p-5 border rounded-2xl border-gray-400">
                    <div className="card-body">
                        <h4 className="font-bold">Personal Account ZWL</h4>
                        <h6 className="text-gray-500">6837363822</h6>
                        <div className="mt-5">
                            <span className="text-gray-500">ZWL</span>
                            <span className="font-bold ml-2">6852.14</span>
                        </div>
                    </div>
                </div>

                <div className="card p-5 border rounded-2xl border-gray-400">
                    <div className="card-body">
                        <h4 className="font-bold">Savings Account ZWL</h4>
                        <h6 className="text-gray-500">6837363822</h6>
                        <div className="mt-5">
                            <span className="text-gray-500">ZWL</span>
                            <span className="font-bold ml-2">6852.14</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-4 mt-5">

                <div className="card p-5 border rounded-2xl border-gray-400 col-span-2">
                    <div className="card-body">
                        <h4 className="font-bold">Recent Bill Payment</h4>                        
                        <div className="mt-5 grid grid-cols-5 gap-2">
                            <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span> 
                                    </div>
                                    <span className="font-semibold">ZESA Prepaid <br /> (ZWL)</span>
                                </div>
                            </div>

                            <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span> 
                                    </div>
                                    <span className="font-semibold">Buy Airtime <br /> (ZWL)</span>
                                </div>
                            </div>

                            <div className="card border border-gray-400 rounded-md p-4">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <span className="text-gray-300">
                                            <i className="fa-solid fa-circle text-5xl"></i>
                                        </span> 
                                    </div>
                                    <span className="font-semibold">ZESA Prepaid <br /> (ZWL)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-5 border rounded-2xl border-gray-400">
                    <div className="card-body">
                        <h6 className="text-gray-500">Interbank Exchange Rate</h6>
                        <h4 className="font-bold">ZWL 800 : 1 USD</h4>
                        <div className="mt-5">
                            <em>#chart</em>
                        </div>
                    </div>
                </div>

            </div>

            <section className="mt-5 pt-4">
                <h4 className="font-bold">Recent Transactions</h4>
                <div className="mt-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                            <tr className="">
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    First Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    1
                                </th>
                                <td className="px-6 py-3.5">
                                    Mark
                                </td>
                                <td className="px-6 py-3.5">
                                    Otto
                                </td>
                                <td className="px-6 py-3.5">
                                    @mdo
                                </td>
                            </tr>
                            <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    2
                                </th>
                                <td className="px-6 py-3.5">
                                    Jacob
                                </td>
                                <td className="px-6 py-3.5">
                                    Thornton
                                </td>
                                <td className="px-6 py-3.5">
                                    @fat
                                </td>
                            </tr>
                            <tr className="bg-white border border-gray-200">
                                <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                    3
                                </th>
                                <td className="px-6 py-3.5">
                                    Larry
                                </td>
                                <td className="px-6 py-3.5">
                                    the Bird
                                </td>
                                <td className="px-6 py-3.5">
                                    @twitter
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </main>
        
    );
}