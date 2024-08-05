"use client"
import { createContext, useState, FC } from 'react';

interface ContextProps{
    user: UserType | undefined,
    setUser: (user: UserType) => void
}

const UserContext = createContext<ContextProps>({user: undefined, setUser:() => { } });


export default UserContext;