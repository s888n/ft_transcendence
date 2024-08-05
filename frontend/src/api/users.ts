import { getAPI, getAPI2, postAPI } from "./APIServices";

export const getUserByUsername = async (username: string) => {
    console.log("getData", {username: username})
    return getAPI2("get_user", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const sendRequest = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("send_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const cancelRequest = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("cancel_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const rejectRequest = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("reject_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const acceptRequest = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("accept_request", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const unfriend = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("unfriend", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const block = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("block", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const deblock = async (username: string) => {
    console.log("postData", {username: username})
    return postAPI("deblock_user", { username: username })
        .then((res: any) => {
            return res;
        })
}

export const getUserStats = async (username: string) => {
    console.log(`game/matches/${username}`)
    return getAPI(`game/matches/${username}`)
        .then((res: any) => {
            return res;
        })
}