import { postAPI2 } from "./APIServices";

interface RegisterInterface {
    email: string;
    password: string;
}

export const register = async (postData: RegisterInterface) => {
    return postAPI2("signup", postData)
    .then((res: any) => {
        return res;
    })
}