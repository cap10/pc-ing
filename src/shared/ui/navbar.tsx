'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionDataByKey } from "../services/auth-service";
import { showToast } from "../utilities/commons";

export default function Navbar() {

    const [userLogged, setUserLogged] = useState('user');
    const [userRole, setUserRole] = useState('');

    function doLogout(){
        // handleLogout()
        // .then(res => {
        //     console.log(res);
            
        // })
        // .catch(err => {
        //     console.log(err);
            
        //     showToast('Failed to logout.', 'error');
        // })

        try {
            sessionStorage.clear();
            showToast('User Logged Out.', 'info');
            document.location.href = userRole !== 'CUSTOMER' ? '/login' : '/';
        } catch (err) {
            console.log(err);
            showToast('Failed to logout.', 'error');
            return false;
    
        }
    }

    useEffect(() => {
        const val = sessionStorage.getItem('display');
        const val2 = sessionStorage.getItem('role');

        getSessionDataByKey(val)
            .then(resp => {
            // console.log(resp);
            
                if(resp) setUserLogged(resp);
            });

        getSessionDataByKey(val2)
            .then(resp => {
            // console.log(resp);
            
                if(resp) setUserRole(resp);
            });

    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-10 flex items-center bg-white print:hidden border-zinc-700">
            
            <div className="flex justify-between w-full">
                <div className="flex items-center topbar-brand">
                    <div className="hidden lg:block navbar-brand items-center justify-between shrink px-6 h-[70px] bg-[#fbfaff] border-b border-[#e9e9ef] shadow-none">
                        <a href="#" className="flex items-center text-lg flex-shrink-0 font-bold text-white leading-[69px]">
                            <Image width={1062} height={2075} src="/images/logo-mini.png" alt="" className="inline-block align-middle w-10 md:hidden mt-3" id="mini-logo"/>
                            <Image width={280} height={60} src="/images/logo.svg" alt="" className="align-middle w-36 mt-2 hidden md:block" id="full-logo"/>
                            {/* <span className="hidden font-bold text-gray-700 align-middle xl:block leading-[69px]">Minia</span> */}
                        </a>
                    </div>
                    <button type="button" className="border-b border-[#e9e9ef] text-gray-800 h-[70px] px-4 py-1 vertical-menu-btn text-16" id="vertical-menu-btn">
                        <i className="fa-solid fa-bars"></i>
                    </button>
        
                </div>
                <div className="flex justify-between w-full items-center border-b border-[#e9e9ef] ltr:pl-6 rtl:pr-6">
                    <div>
                        <h1 id="modName">&nbsp;</h1>
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
                                    <span className="hidden font-medium xl:block px-2">{userLogged}</span>
                                    <i className="hidden align-bottom fa-solid fa-chevron-down xl:block"></i>
                                </button>
                                <div className="absolute top-0 z-50 hidden w-40 list-none bg-white dropdown-menu dropdown-animation rounded shadow " id="profile/log">
                                    <div className="border border-gray-50" aria-labelledby="navNotifications">
                                        {/* <div className="dropdown-item text-gray-100">
                                            <a className="block px-3 py-2 hover:bg-gray-50/50" href="apps-contacts-profile.html">
                                                <i className="mr-1 align-middle mdi mdi-face-man text-16"></i> Profile
                                            </a>
                                        </div> */}
                                        <div className="dropdown-item">
                                            <a className="block px-3 py-2 hover:bg-gray-200" href="#">
                                                <i className="mr-1 align-middle mdi mdi-lock text-16"></i> Lock Screen
                                            </a>
                                        </div>
                                        <hr className="border-gray-50" />
                                        <div className="dropdown-item">
                                            <Link className="block p-3 hover:bg-red-100" onClick={doLogout} href='#'>
                                                <i className="mr-1 align-middle mdi mdi-logout text-16"></i> Logout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </nav>
    );
}