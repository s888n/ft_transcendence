import React from 'react';
import {useState} from 'react';

interface ChatContextType {
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}


interface ChatProviderProps {
    children: React.ReactNode;
  }
  
export const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
  
    return (
      <ChatContext.Provider value={{ refresh, setRefresh, messages, setMessages }}>
        {children}
      </ChatContext.Provider>
    );
  };