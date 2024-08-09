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

    return children;
});

export default WithAuth;
