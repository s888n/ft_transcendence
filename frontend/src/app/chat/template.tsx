"use client"

import React, { useEffect } from 'react';
import Navbar from "@/Components/Navbar"
import { SocketProvider } from "@/contexts/SocketProvider";
import { ChatProvider } from "@/contexts/ChatProvider";

const Template = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div>
      <Navbar />
        <SocketProvider>
          <ChatProvider>
          {children}
          </ChatProvider>
        </SocketProvider>
    </div>
  );
};

export default Template;
