"use client";
import { FC, useEffect, useState } from "react";
import UserContext from "./UserContext";
import NavbarContext from "./NavbarContext";

interface ComponentProps {
  children: React.ReactNode;
}

const ContextsProviders: FC<ComponentProps> = ({ children }) => {
  const [user, setUserState] = useState<UserType | undefined>();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const setUser = (newUser: UserType) => {

    localStorage.setItem("user_name", newUser.username);
    localStorage.setItem("user_email", newUser.email);
    localStorage.setItem("user_nickname", newUser.nickname);
    localStorage.setItem("user_id", String(newUser.id));
    localStorage.setItem("user_avatar", newUser.avatar);

    setUserState(newUser);
  };

  useEffect(() => {
    const defaultState = {
      username: localStorage.getItem("user_name") || "",
      email: localStorage.getItem("user_email") || "",
      nickname: localStorage.getItem("user_nickname") || "",
      avatar: localStorage.getItem("user_avatar") || "default.png",
      id: Number(localStorage.getItem("user_id")) || 0,
      is_online: true,
    }
    setUser(defaultState)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavbarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        {children}
      </NavbarContext.Provider>
    </UserContext.Provider>
  );
};

export default ContextsProviders;
