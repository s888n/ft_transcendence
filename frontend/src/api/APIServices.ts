import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';

// ------------------------------- Params Global ----------------------- //

const config: AxiosRequestConfig = {
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

const config2: AxiosRequestConfig = {
    baseURL: "http://127.0.0.1:3000/api",
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
        console.log("errrorrrr", error)
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
    console.log("urllll", `${config.baseURL}/${url}`, data)
    return await axios({
        ...config,
        method: 'post',
        url: `${config.baseURL}/${url}`,
        data: data,
    })
        .then((response: AxiosResponse) => {
            console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log("errrrrr", error)
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

export const postAPI2 = async (url: string, data: unknown): Promise<unknown> => {
    console.log("urllll", `${config2.baseURL}/${url}`, data)
    return await axiosInstance({
        ...config2,
        method: 'post',
        url: `${config2.baseURL}/${url}`,
        data: data,
    })
        .then((response: AxiosResponse) => {
            console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log("errrrrr", error)
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
            console.log(error);
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
            console.log(error);
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
            console.log("url", url)
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            console.log("errrrrrrorrrr");
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
            console.log("url", url)
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            console.log("errrrrrrorrrr");
            return {
                status: error.response.status,
                data: error.response.data,
            };
        });
};
