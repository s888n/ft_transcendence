"use client";

// Import the necessary modules
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FC, memo, useEffect } from 'react';
// import { axiosInstance, getAPI2 } from '@/api/APIServices';


interface WithAuthProps {
    children: React.ReactNode;
}

const WithAuth: FC<WithAuthProps> = memo(({children}) => {
    const router = useRouter();

    // useEffect(() => {
    //     console.log("WithAuth");
    //     const interceptor = axios.interceptors.response.use(
    //         function (response) {
                
    //             console.log('Response:', response);
    //             return response;
    //         },
    //         async function (error) {
                
    //             if (error.response && error.response.status === 401) {
    //                 console.error('Unauthorized, logging out...');
    //                 const res = await getAPI2("/logout");
    //                 console.log("res", res)
    //                 localStorage.clear(); 
    //                 router.push('/login'); 
    //             }
    //             return Promise.reject(error);
    //         }
    //     );
    //     const interceptor2 = axiosInstance.interceptors.response.use(
    //         function (response) {

    //             console.log('Response:', response);
    //             return response;
    //         },
    //         async function (error) {

    //             if (error.response && error.response.status === 401) {
    //                 console.error('Unauthorized, logging out...');
    //                 const res = await getAPI2("/logout");
    //                 console.log("res", res)
    //                 localStorage.clear();
    //                 router.push('/login');
    //             }
    //             return Promise.reject(error);
    //         }
    //     );

    //     return () => {
    //         axios.interceptors.response.eject(interceptor);
    //         axiosInstance.interceptors.response.eject(interceptor2);
    //     };
    // }, [router]);

    return children;
});

export default WithAuth;
