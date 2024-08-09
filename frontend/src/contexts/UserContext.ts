"use client"
import { createContext, useState, FC } from 'react';

interface ContextProps {
    user: UserType | undefined,
    setUser: (user: UserType) => void
}

const defaultState = {
    username: localStorage.getItem("user_name") || "",
    email: localStorage.getItem("user_nemail") || "",
    nickname: localStorage.getItem("user_nickname") || "",
    avatar: "default.png",
    id: Number(localStorage.getItem("user_id")) || 0,
    is_online: true,
}

const UserContext = createContext<ContextProps>({ user: defaultState, setUser: () => { } });


export default UserContext;