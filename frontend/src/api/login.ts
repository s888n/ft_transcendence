import axios from "axios";
import { postAPI2 } from "./APIServices";

interface LoginInterface {
    email: string;
    password: string;
}

export const login = async (postData: LoginInterface) => {
    return postAPI2("login", postData)
        .then((res: any) => {
            return res;
        })
}

const get42Token = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code')
    return axios.get(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/get_42_token?code=${code}`)
        .then((res: any) => {
            return res.data;
        })
}

export const login42Intra = async () => {
    console.log("fffg")
    const tokenRes = await get42Token();
    console.log("fffg", tokenRes)


    return postAPI2("intra", { 'access_token': tokenRes.data['access_token'] })
        .then((res: any) => {
            return {
                data: res.data,
                status: 201
            };
        })
}

