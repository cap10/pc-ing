import Image from "next/image";

export default function Home() {
    const year = new Date().getFullYear();

    return (
        
        <section>
            <div className="fixed bottom-0 z-10 h-screen ltr:border-r rtl:border-l vertical-menu rtl:right-0 ltr:left-0 top-[70px] bg-slate-50 border-gray-50 print:hidden">
        
                <div data-simplebar className="h-full">
                    
                    <div className="metismenu pb-10 pt-4" id="sidebar-menu">
                        
                        <ul id="side-menu">
                            
                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                    </svg>
                                    <span className="ml-3"> Dashboard</span>
                                </a>
                            </li>

                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                    </svg>
                                    <span className="ml-3"> Accounts</span>
                                </a>
                            </li>
            
                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    <span className="ml-3"> Payments</span>
                                </a>
                            </li>

                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(45 0 0)" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span className="ml-3"> Transfers</span>
                                </a>
                            </li>

                            <hr className="my-4"/>

                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                    </svg>
                                    <span className="ml-3"> Services</span>
                                </a>
                            </li>

                            <li>
                                <a href="index.html" className="flex py-2.5 px-6 text-sm font-medium text-gray-600 transition-all duration-150 ease-linear hover:text-color-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <span className="ml-3"> Settings</span>
                                </a>
                            </li>
            
                            {/* <li>
                                <a href="javascript: void(0);" aria-expanded="false" className="block py-2.5 px-6 text-sm font-medium text-gray-950 transition-all duration-150 ease-linear nav-menu hover:text-color-secondary">
                                    <i data-feather="map"></i>
                                    <span data-key="t-maps"> Maps</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="maps-google.html" className="block py-[6.4px] pr-6 text-sm font-medium text-gray-950 transition-all duration-150 ease-linear pl-[52.8px] hover:text-color-secondary">Google</a>
                                    </li>
                                    <li>
                                        <a href="maps-vector.html" className="block py-[6.4px] pr-6 text-sm font-medium text-gray-950 transition-all duration-150 ease-linear pl-[52.8px] hover:text-color-secondary">Vector</a>
                                    </li>
                                    <li>
                                        <a href="maps-leaflet.html" className="block py-[6.4px] pr-6 text-sm font-medium text-gray-950 transition-all duration-150 ease-linear pl-[52.8px] hover:text-color-secondary">Leaflet</a>
                                    </li>
                                </ul>
                            </li> */}
            
                        </ul>
            
                    </div>
                    
                </div>
            </div>
            

            <nav className="fixed top-0 left-0 right-0 z-10 flex items-center bg-white print:hidden border-zinc-700">
            
                <div className="flex justify-between w-full">
                    <div className="flex items-center topbar-brand">
                        <div className="hidden lg:flex navbar-brand items-center justify-between shrink px-6 h-[70px] bg-[#fbfaff] border-b border-[#e9e9ef] shadow-none">
                            <a href="#" className="flex items-center text-lg flex-shrink-0 font-bold text-white leading-[69px]">
                                <Image width={280} height={60} src="/images/metbank-logo.png" alt="" className="inline-block align-middle w-40" />
                                {/* <span className="hidden font-bold text-gray-700 align-middle xl:block leading-[69px]">Minia</span> */}
                            </a>
                        </div>
                        <button type="button" className="border-b border-[#e9e9ef] text-gray-800 h-[70px] px-4 py-1 vertical-menu-btn text-16" id="vertical-menu-btn">
                            <i className="fa-solid fa-bars"></i>
                        </button>
            
                    </div>
                    <div className="flex justify-between w-full items-center border-b border-[#e9e9ef] ltr:pl-6 rtl:pr-6">
                        <div>
                            <h1>Module Name</h1>
                        </div>
                        <div className="flex">
                            <div>
                                <button type="button" className="px-3 py-1 items-center mt-5 text-gray-400">
                                    <i className="fa-regular fa-circle-question"></i> <span>Help Center</span>
                                </button>
                            </div>
                            <div>
                                <div className="relative dropdown">
                                    <button type="button" className="flex items-center px-3 py-2 h-[70px] border-x border-gray-50 dropdown-toggle " id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <Image width={250} height={250} className="border-[3px] border-gray-400 rounded-full w-9 h-9 ltr:xl:mr-2 rtl:xl:ml-2" src="/images/avatar.svg" alt="Header Avatar" />
                                        <span className="hidden font-medium xl:block px-2">Chriss Desy</span>
                                        <i className="hidden align-bottom fa-solid fa-chevron-down xl:block"></i>
                                    </button>
                                    <div className="absolute top-0 z-50 hidden w-40 list-none bg-white dropdown-menu dropdown-animation rounded shadow " id="profile/log">
                                        <div className="border border-gray-50" aria-labelledby="navNotifications">
                                            <div className="dropdown-item text-gray-100">
                                                <a className="block px-3 py-2 hover:bg-gray-50/50" href="apps-contacts-profile.html">
                                                    <i className="mr-1 align-middle mdi mdi-face-man text-16"></i> Profile
                                                </a>
                                            </div>
                                            <div className="dropdown-item text-gray-100">
                                                <a className="block px-3 py-2 hover:bg-gray-50/50" href="lock-screen.html">
                                                    <i className="mr-1 align-middle mdi mdi-lock text-16"></i> Lock Screen
                                                </a>
                                            </div>
                                            <hr className="border-gray-50" />
                                            <div className="dropdown-item text-gray-100">
                                                <a className="block p-3 hover:bg-gray-50/50" href="logout.html">
                                                    <i className="mr-1 align-middle mdi mdi-logout text-16"></i> Logout
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="main-content group-data-[sidebar-size=sm]:ml-[70px]">
                <div className="min-h-screen page-content">

                    <div className="container-fluid px-[0.625rem]">

                        <div className="grid grid-cols-1 pb-6">
                            <div className="md:flex items-center justify-between px-[2px]">
                                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Starter Page</h4>
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 ltr:md:space-x-3 rtl:md:space-x-0">
                                        <li className="inline-flex items-center">
                                            <a href="#" className="inline-flex items-center text-sm text-gray-800 hover:text-gray-900">
                                                Pages
                                            </a>
                                        </li>
                                        <li>
                                            <div className="flex items-center rtl:mr-2">
                                            <i className="font-semibold text-gray-600 align-middle far fa-angle-right text-13 rtl:rotate-180 "></i>
                                                <a href="#" className="text-sm font-medium text-gray-500 ltr:ml-2 rtl:mr-2 hover:text-gray-900 ltr:md:ml-2 rtl:md:mr-2">Starter Page</a>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        
                        <footer className="absolute bottom-0 left-0 right-0 px-5 py-5 bg-white border-t footer border-gray-200 mr-6 ml-6">
                            <div className="grid grid-cols-2 text-gray-700">
                                <div className="grow col-start-2 text-right">
                                    &copy; {year} IBanking.
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

        </section>
        
    );
}