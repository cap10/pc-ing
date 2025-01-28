import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Corporates',
};

export default function Corporates() {
    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0" id="moduleName">Corporate Customers</h4>
                <Link href="/dashboard/customers/corporates/new" className="button p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-regular fa-plus mr-2"></i>
                    New Customer
                </Link>
            </div>
            <hr />
        </main>
    );
}