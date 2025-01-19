/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import nextConfig from "../../../next.config";
import { clearSessionData, getSessionData } from "../repositories/storage-repository";


// Login management
export const adminLogin = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}authenticate`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.json();
}

export const customerLogin = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}authenticate/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.json();
}

// Password Management
export const resetUserPassword = async (ref: string) => {
    const res = await fetch(`${nextConfig.API_Endpoint}users/reset-password/admin/${ref}`, {method: 'PUT'});
    return await res.json();
}

export const changePassword = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}users/update-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.json();
}

export const forgotPassword = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}users/forgot-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.text();
}

export const setPassword = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}users/set-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.json();
}

export const resetPassword = async (data: any) => {
    const response = await fetch(`${nextConfig.API_Endpoint}users/reset-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-type': 'application/json'
      }
    });
    return await response.json();
}

// session management
export const getSessionDataByKey = async (key: string | null) => {
    if(key){
        return await getSessionData(key);
    }
}

export const isLogged = async (): Promise<boolean> => {
    const myToken = getSessionDataByKey('atoken');

    return (myToken !== null);
}

export const handleLogout = async (): Promise<boolean> => {
    return await clearSessionData();
}