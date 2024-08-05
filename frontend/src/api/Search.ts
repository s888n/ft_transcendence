import { getAPI2 } from "./APIServices";

export const searchForUser = async (username: string) => {
    console.log("USEEEER", username)
    if (username.trim().length === 0)
        return {data: [], status: 200};
    return getAPI2(`search/${username}`)
        .then((res: any) => {
            if (res.status !== 200)
                throw new Error('Failed to fetch data');
            console.log("response :", res)
            return res;
        })
}
