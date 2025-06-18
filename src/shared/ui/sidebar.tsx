import Link from "next/link";

export default function Sidebar(){

    function determineActiveLink(){
        return 'active';
    }

    return (
        <div
            data-simplebar='init'
            className="h-full bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 fixed md:relative w-[70px] md:w-[250px] transition-all duration-300 ease-in-out"
        >
            <div className="metismenu pb-10 pt-4" id="sidebar-menu">
                <ul id="side-menu" className="metismenu space-y-1 px-2">
                    {/* Dashboard */}
                    <li className="group">
                        <Link href="/myspace"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Dashboard</span>
                        </Link>
                    </li>

                    {/* Accounts */}
                    <li className="group">
                        <Link href="/myspace/accounts"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Accounts</span>
                        </Link>
                    </li>

                    {/* Beneficiaries */}
                    <li className="group">
                        <Link href="/myspace/beneficiaries"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Beneficiaries</span>
                        </Link>
                    </li>

                    {/* Payments Dropdown */}
                    <li className="group">
                        <a href="#" aria-expanded="false"
                           className="flex items-center justify-between py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 cursor-pointer">
                            <div className="flex items-center">
                                <div
                                    className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.8" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                                    </svg>
                                </div>
                                <span className="ml-3 hidden md:block">Payments</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-4 w-4 text-gray-400 transition-transform duration-200 hidden md:block"
                                 fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                        </a>
                        <ul className="pl-4 mt-1 space-y-1 hidden md:block">
                            <li>
                                <a href="#"
                                   className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    Utilities Bills
                                </a>
                            </li>
                            <li>
                                <Link href="/myspace/airtime"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    Airtime
                                </Link>
                            </li>
                            <li>
                                <Link href="/myspace/data"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    Data
                                </Link>
                            </li>
                            <li>
                                <Link href="/myspace/zesa"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    ZESA
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Transfers Dropdown */}
                    <li className="group">
                        <a href="#" aria-expanded="false"
                           className="flex items-center justify-between py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 cursor-pointer">
                            <div className="flex items-center">
                                <div
                                    className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.8" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                                    </svg>
                                </div>
                                <span className="ml-3 hidden md:block">Transfers</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-4 w-4 text-gray-400 transition-transform duration-200 hidden md:block"
                                 fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                        </a>
                        <ul className="pl-4 mt-1 space-y-1 hidden md:block">
                            <li>
                                <Link href="/myspace/zipit"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    ZIPIT
                                </Link>
                            </li>
                            <li>
                                <Link href="/myspace/rtgs"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    RTGS
                                </Link>
                            </li>
                            <li>
                                <Link href="/myspace/internal"
                                      className="flex items-center py-2 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 pl-11">
                                    INTERNAL
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Categories */}
                    <li className="group">
                        <Link href="/myspace/categories"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Categories</span>
                        </Link>
                    </li>

                    <hr className="my-4 border-gray-200 mx-4 hidden md:block"/>

                    {/* Services */}
                    <li className="group">
                        <Link href="/myspace/services"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Services</span>
                        </Link>
                    </li>

                    {/* Settings */}
                    <li className="group">
                        <Link href="/myspace/settings"
                              className="flex items-center py-2.5 px-4 text-sm font-medium text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-indigo-600 group-[.active]:bg-indigo-50 group-[.active]:text-indigo-600">
                            <div
                                className="p-1.5 rounded-lg bg-cyan-400 text-white group-hover:bg-white group-hover:text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.8" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                            </div>
                            <span className="ml-3 hidden md:block">Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}