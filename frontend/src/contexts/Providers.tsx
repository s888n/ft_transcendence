"use client";
import { FC, useState } from "react";
import UserContext from "./UserContext";
import NavbarContext from "./NavbarContext";

interface ComponentProps {
  children: React.ReactNode;
}

const ContextsProviders: FC<ComponentProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | undefined>();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser}}>
      <NavbarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        {children}
      </NavbarContext.Provider>
    </UserContext.Provider>
  );
};

export default ContextsProviders;
