import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';

// ------------------------------- Params Global ----------------------- //

const config: AxiosRequestConfig = {
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

const config2: AxiosRequestConfig = {
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

// --------------------------- POST request ------------------------------ //

const axiosInstance = axios.create({
    ...config
});

axios.interceptors.request.use(
    async config => {
        const accessToken = localStorage.getItem('user_token');
        if (!accessToken) {
            return config;
        }
        const tokenExpiration = localStorage.getItem('token_expiration');
        if (tokenExpiration && new Date(Number(tokenExpiration) * 1000) < new Date()) {
            console.error('Token expiered:');
            await getAPI2("/logout");
            localStorage.clear()
            window.location.href = '/login';
        } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    async config => {
        return config;
    },
    async (error) => {
        if (error.response.status === 401){
            console.error('Unautherized:');
            await getAPI2("/logout");
            localStorage.clear()
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const postAPI = async (url: string, data: unknown): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'post',
        url: `${config.baseURL}/${url}`,
        data: data,
    })
        .then((response: AxiosResponse) => {
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

export const postAPI2 = async (url: string, data: unknown): Promise<unknown> => {
    return await axiosInstance({
        ...config2,
        method: 'post',
        url: `${config2.baseURL}/${url}`,
        data: data,
    })
        .then((response: AxiosResponse) => {
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

// --------------------------- GET request ------------------------------ //

export const getAPI = async (url: string, data?: unknown): Promise<unknown> => {
    let new_url = `${config.baseURL}/${url}`;
    if (data !== undefined) {
        const params = new URLSearchParams(data as Record<string, string>);
        new_url += `?${params.toString()}`;
    }

    return await axios({
        ...config,
        method: 'get',
        url: new_url,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

export const getAPI2 = async (url: string, data?: unknown): Promise<unknown> => {
    let new_url = `${config2.baseURL}/${url}`;
    if (data !== undefined) {
        const params = new URLSearchParams(data as Record<string, string>);
        new_url += `?${params.toString()}`;
    }

    return await axiosInstance({
        ...config2,
        method: 'get',
        url: new_url,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

//  -------------------------- PUT request ------------------------------ //
// Update with new version

export const putAPI = async (url: string, data: unknown, id?: number): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'put',
        url: `${config.baseURL}/${url}${id ? "/" + id : ''}`,
        data,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response.data,
            };
        });
};

export const putAPI2 = async (url: string, data: unknown, id?: number): Promise<unknown> => {
    return await axiosInstance({
        ...config2,
        method: 'put',
        url: `${config2.baseURL}/${url}${id ? "/" + id : ''}`,
        data,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response.data,
            };
        });
};
