"use client"
import Axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

export const getToken = (): string => <string>Cookies.get("access_token");

export const getAuthHeaders = () => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    return { Authorization: `Bearer ${token}` };
};

export const axiosClient = Axios.create({
    baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ,
});

axiosClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
}, function (error: AxiosError) {

    console.log(error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const status = error.response?.status || 500;


    switch (status) {
        case 401: {
            return window.location.href = '/login'
        }
        default: {
            return Promise.reject(error);
        }
    }


});
