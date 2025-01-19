/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import nextConfig from "../../../next.config";

// User management
export const getUserClerks = async (page: number, size: number) => {
  const res = await fetch(`${nextConfig.API_Endpoint}users/clerks?page=${page}&size=${size}`);
  return await res.json();
};

export const getUserGroups = async () => {
  const res = await fetch(`${nextConfig.API_Endpoint}groups/all`);
  return await res.json();
};

export const createUserClerk = async(data: any) => {
  const response = await fetch(`${nextConfig.API_Endpoint}users/clerks`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json'
    }
  });
  return await response.json();
}

export const deleteUser = async(ref: string) => {
  const res = await fetch(`${nextConfig.API_Endpoint}users/${ref}`, {method: 'DELETE'});
  // console.log(res.text());
  return await res.text();
}

export const updateUser = async(ref: string, data: any) => {
  const res = await fetch(`${nextConfig.API_Endpoint}users/reset-password/admin/${ref}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json'
    }
  });
  return await res.json();
}

export const changeUserStatus = async(ref: string, enable: boolean) => {
  const res = await fetch(`${nextConfig.API_Endpoint}users/${ref}?enable=${enable}`, {method: 'PATCH'});
  return await res.json();
}


// banks management
export const getActiveBanks = async () => {
  const res = await fetch(`${nextConfig.API_Endpoint}banks/active`);
  return await res.json();
};

export const getAllBanks = async () => {
  const res = await fetch(`${nextConfig.API_Endpoint}banks`);
  return await res.json();
};

export const createBank = async(data: any) => {
  const response = await fetch(`${nextConfig.API_Endpoint}banks`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json'
    }
  });
  return await response.json();
}

export const deleteBank = async(ref: string) => {
  const res = await fetch(`${nextConfig.API_Endpoint}banks/${ref}`, {method: 'DELETE'});
  return await res.text();
}

export const activateDeactivateBank = async(ref: string, mode: string) => {
  const res = (mode == 'activate') ?
                 await fetch(`${nextConfig.API_Endpoint}banks/activate/${ref}`, {method: 'PUT'}) :
                 await fetch(`${nextConfig.API_Endpoint}banks/deactivate/${ref}`, {method: 'PUT'});
  return await res.json();
}
