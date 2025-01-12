import Link from "next/link";

export default function Sidebar(){

    return (
        <div data-simplebar='init' className="h-full">
                    
            <div className="metismenu pb-10 pt-4" id="sidebar-menu">
                
                <ul id="side-menu" className="metismenu">
                    
                    <li className="active">
                        <Link href="/dashboard" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            </svg>
                            <span className="ml-3"> Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/dashboard/accounts" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                            </svg>
                            <span className="ml-3"> Accounts</span>
                        </Link>
                    </li>
    
                    {/* <li>
                        <Link href="/dashboard/payments" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span className="ml-3"> Payments</span>
                        </Link>
                    </li> */}

                    <li>
                        <a href={undefined} aria-expanded="false" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear nav-menu cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span data-key="t-auth" className="ml-3" >Payments</span>
                        </a>
                        <ul>
                            <li>
                                <a href="#" className="pl-[52.8px] pr-6 py-[6.4px] block text-[13.5px] font-medium text-gray-600 transition-all duration-150 ease-linear">Utilities Bills</a>
                            </li>
                            <li>
                                <a href="#" className="pl-[52.8px] pr-6 py-[6.4px] block text-[13.5px] font-medium text-gray-600 transition-all duration-150 ease-linear">Pay Airtime</a>
                            </li>
                            <li>
                                <a href="#" className="pl-[52.8px] pr-6 py-[6.4px] block text-[13.5px] font-medium text-gray-600 transition-all duration-150 ease-linear">Pay Data</a>
                            </li>
                            <li>
                                <a href="#" className="pl-[52.8px] pr-6 py-[6.4px] block text-[13.5px] font-medium text-gray-600 transition-all duration-150 ease-linear">Pay Bills</a>
                            </li>
                            <li>
                                <a href="#" className="pl-[52.8px] pr-6 py-[6.4px] block text-[13.5px] font-medium text-gray-600 transition-all duration-150 ease-linear">Pay School</a>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link href="/dashboard/transfers" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(45 0 0)" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span className="ml-3"> Transfers</span>
                        </Link>
                    </li>

                    <hr className="my-4"/>

                    <li>
                        <Link href="/dashboard/services" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                            <span className="ml-3"> Services</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/dashboard/settings" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span className="ml-3"> Settings</span>
                        </Link>
                    </li>
    
                </ul>
    
            </div>
            
        </div>
    );
}