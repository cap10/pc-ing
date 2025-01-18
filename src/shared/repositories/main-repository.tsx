/* eslint-disable @typescript-eslint/no-explicit-any */

import { changeUserStatus, createUserClerk, deleteUser, getUserClerks, getUserGroups } from "../services/main-service";

export const getClerkUsers  = async (page: number, size: number) => {
    const data = await getUserClerks(page, size);
    return data;
}

export const getUserRoles = async() => {
    const data = await getUserGroups();
    return data;
}

export const createClerkUser = async(data: any) => {
    try {
        const response = await createUserClerk(data);
        return response;
    } catch (error) {
        return error;
    }
}

export const userStatus = async(ref: string, mode: boolean) => {
    try {
        const response = await changeUserStatus(ref, mode);
        return response;
    } catch (error) {
        return error;
    }
}

export const userDelete = async(ref: string) => {
    try {
        const response = await deleteUser(ref);
        return response;
    } catch (error) {
        return error;
    }
}