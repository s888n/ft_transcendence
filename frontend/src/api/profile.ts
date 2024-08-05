import { putAPI2, getAPI2 } from "./APIServices";
export const updateProfile = async (postData: unknown) => {
    return putAPI2("profile", postData)
        .then((res: any) => {
            if (res.status === 202) {
                localStorage.setItem("user_name", res.data?.username ? res.data.username : "")
                localStorage.setItem("user_email", res.data?.email ? res.data.email : "")
                localStorage.setItem("user_avatar", res.data?.avatar ? res.data.avatar : "")
                localStorage.setItem("user_nickname", res.data?.nickname ? res.data.nickname : "")
                localStorage.setItem('user_id', res.data?.id ? res.data.id :"")
            }
            return res;
        })
}

export const getProfileData = async () => {
    return getAPI2("profile")
        .then((res: any) => {
            if (res.status === 200) {
                localStorage.setItem("user_name", res.data?.username ? res.data.username : "")
                localStorage.setItem("user_email", res.data?.email ? res.data.email : "")
                localStorage.setItem("user_avatar", res.data?.avatar ? res.data.avatar : "")
                localStorage.setItem("user_nickname", res.data?.nickname ? res.data.nickname : "")
                localStorage.setItem('user_id', res.data?.id ? res.data.id :"")
                
            }
            return res;
        })
}

export const updatePassword = async (postData: unknown) => {
    return putAPI2("change_password", postData)
        .then((res: any) => {
            
            return res;
        })
}

