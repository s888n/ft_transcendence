import { getAPI, getAPI2, postAPI } from "./APIServices";

export const getUserByUsername = async (username: string) => {
    return getAPI2("get_user", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const sendRequest = async (username: string) => {
    return postAPI("send_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const cancelRequest = async (username: string) => {
    return postAPI("cancel_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const rejectRequest = async (username: string) => {
    return postAPI("reject_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const acceptRequest = async (username: string) => {
    return postAPI("accept_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const unfriend = async (username: string) => {
    return postAPI("unfriend", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const block = async (username: string) => {
    return postAPI("block", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const deblock = async (username: string) => {
    return postAPI("deblock_user", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const getUserStats = async (username: string) => {
    console.log("usernameeee callll")
    return getAPI(`game/matches/${username}`)
        .then((res: any) => {
            return res;
        })
}


export const getFriendRequests = async () => {
    return getAPI('get_friend_requests')
        .then((res: any) => {
            return res;
        })
}