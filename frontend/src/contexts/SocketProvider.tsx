'use client'


import { toast } from 'react-toastify';
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

interface SocketContextType {
    socket: WebSocket | null;
    sendMessage: (message: string, chatroomId: number, sender_id: number, receiver_id: number, type: string) => void;
    sendReadEvent: (chatroomId: number, sender_id: number, receiver_id: number) => void;
    onMessage: (callback: (message: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children?: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messageListeners = useRef<((message: any) => void)[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_ENDPOINT}chat/private/?token=${token}`);

        socket.onopen = () => {
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            messageListeners.current.forEach(listener => listener(message));
        };

        socket.onclose = () => {
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };


        setSocket(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = useCallback((message: string, chatroomId: number, sender_id: number, receiver_id: number, type: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const data = {
                message: message,
                chatroom_id: chatroomId,
                type: type,
                sender_id: sender_id,
                receiver_id: receiver_id
            };
            socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not open');
        }
    }, [socket]);

    const sendReadEvent = useCallback((chatroomId: number, sender_id: number, receiver_id: number) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const data = {
                chatroom_id: chatroomId,
                type: 'read',
                sender_id: sender_id,
                receiver_id: receiver_id
            };
            socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not open');
        }
    }, [socket]);


    const onMessage = useCallback((callback: (message: any) => void) => {
        messageListeners.current.push(callback);
        return () => {
            messageListeners.current = messageListeners.current.filter(listener => listener !== callback);
        };
    }, []);


    return (
        <SocketContext.Provider value={{ socket, sendMessage, onMessage, sendReadEvent }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};