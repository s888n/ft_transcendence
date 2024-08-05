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
    console.log("hereeee")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code')
    return axios.get(`http://127.0.0.1:3000/api/get_42_token?code=${code}`)
        .then((res: any) => {
            return res.data;
        })
}

export const login42Intra = async () => {
    console.log("hereeee")
    const tokenRes = await get42Token();
    console.log("hereeee", tokenRes)

    return postAPI2("intra", { 'access_token': tokenRes.data['access_token'] })
        .then((res: any) => {
            console.log("res", res)
            console.log("reply", {
                data: res.data,
                status: 201
            })
            console.log("data", res.data)
            return {
                data: res.data,
                status: 201
            };
        })
}

