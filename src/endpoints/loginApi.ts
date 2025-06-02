"use client"
import Axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';


export const loginAxiosClient = Axios.create({
    baseURL:
    process.env.NEXT_PUBLIC_BASE_URL,
});

loginAxiosClient.interceptors.request.use((config) => {

    return config;
});

// Add a response interceptor
loginAxiosClient.interceptors.response.use(function (response) {
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
