'use client'
import React,{useEffect,useState,useRef , useContext} from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '@/contexts/UserContext';
import { HiChat } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { getRooms } from '@/api/chat';
import { IconContext } from 'react-icons';

import { useSocket } from '@/contexts/SocketProvider';
import ChatLoader from './components/ChatLoader';

import { getProfileData } from '@/api/profile';

import Popup from './components/Popup';
import ChatBox from './components/ChatBox';
import ChatRoom from './components/ChatRoom';
import RoomsList from './components/RoomsList';
import FriendsList from './components/FriendsList';
import {ChatContext} from '@/contexts/ChatProvider';








export default function Page() {
  
    const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(null);
    const [rooms, setRooms] = useState<Chatroom[]>([]);
    const { user, setUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('users');
    const router = useRouter();
    const { sendMessage, onMessage, sendReadEvent } = useSocket();
  
  
    const fetchRooms = async () => {
      try {
         let userId = user?.id;
         if (!userId) {
           const userIdStr = localStorage.getItem('user_id');
           if (!userIdStr) {
             console.error("User is undefined and user_id is not in local storage");
             return;
           }
         userId = parseInt(userIdStr);
         }
           const res = await getRooms(userId.toString());
           setRooms(res);
         } catch (error) {
           console.error("Error fetching rooms:", error);
         }
       };
    
  
    useEffect(() => {
      if (user !== undefined) {
        fetchRooms();
      }
    }, [user]);

    useEffect(() => {
      if (selectedChatroom && user) {
        sendReadEvent(selectedChatroom.id, user.id, selectedChatroom.friend_id);
      }
    }, [selectedChatroom, user]);
  


  
    if (user == null || user === undefined) {
      return <ChatLoader />;
    }
  
    return (
      <div className="flex h-[90vh] ">
        {/* Left side users */}
        <div className="flex-shrink-0 w-3/12 min-w-60 max-w-80">
          <div className="flex flex-row">
            <button
              className={`w-1/2 flex flex-row justify-center rounded hover:bg-gray-300 transition duration-300 ease-in-out ${activeTab === 'users' ? 'bg-gray-300 ' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <HiUsers className="w-7 h-8" />
            </button>
            <button
              className={`w-1/2 flex flex-row justify-center rounded hover:bg-gray-300 transition duration-300 ease-in-out ${activeTab === 'chatrooms' ? 'bg-gray-300' : ''}`}
              onClick={() => setActiveTab('chatrooms')}
            >
              <HiChat className="w-7 h-8" />
            </button>
          </div>
          <div>
          {/* <OnlineFriends friends={friends} /> */}
            {activeTab === 'users' && (
              <FriendsList
                selectedChatroom={selectedChatroom}
                setSelectedChatroom={setSelectedChatroom}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                rooms={rooms}
                user={user}
              />
            )}
            {activeTab === 'chatrooms' && (
              <RoomsList
                rooms={rooms}
                selectedChatroom={selectedChatroom}
                setSelectedChatroom={setSelectedChatroom}
              />
            )}
          </div>
        </div>
  
        {/* Right side chat room */}
        <div className="flex-grow w-9/12 h-full bg-gray ">
          {selectedChatroom ? (
            <div className="h-full">
              <ChatRoom user={user} selectedChatroom={selectedChatroom}  />
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <p className="text-2xl text-gray-400">Select a chatroom</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  