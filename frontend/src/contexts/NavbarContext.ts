"use client"
import { createContext } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface ContextProps{
    toggleSidebar: boolean;
    setToggleSidebar: Dispatch<SetStateAction<boolean>>
}

const NavbarContext = createContext<ContextProps>({toggleSidebar: false, setToggleSidebar:() => { }});


export default NavbarContext;