import React from 'react';
import Image from 'next/image';
import FriendPopup from './FriendPopup';
import { useEffect, useState } from 'react';
import { getFriends } from '@/api/chat';
import { useSocket } from '@/contexts/SocketProvider';



type FriendType = {
  id: number;
  username: string;
  avatar: string;
  is_online: boolean;
};

type FriendlistProps = {
  selectedChatroom: Chatroom | null;
  setSelectedChatroom: (chatroom: Chatroom | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rooms: Chatroom[];
  user: UserType;
};



const FriendsList: React.FC<FriendlistProps> = ({ selectedChatroom, setSelectedChatroom, activeTab, setActiveTab, rooms, user }) => {
  const createChatroom = (friend: FriendType) => {
    const chatroom = rooms.find(room => room.friend === friend.username);
    setSelectedChatroom(chatroom || null);
    if (chatroom) {
      setActiveTab('chatrooms');
    }
  };
  const [Friends, setFriends] = useState<FriendType[]>([]);
  const { onMessage } = useSocket();




  const fetchFriends = async () => {
    try {
      const res = await getFriends();
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setFriends(res.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };


  useEffect(() => {
    const handleMessage = (incomingMessage: any) => {
      fetchFriends();
    };

    const cleanup = onMessage(handleMessage);

    return () => {
      cleanup();
    };
  }, [onMessage]);


  useEffect(() => {
    fetchFriends();
  }, []);



  return (
    <div className="mt-1">
      <h3 className="text-lg text-myred font-semibold mb-1 px-2">Friends</h3>
      <aside className="py-1">
        {Friends.length === 0 && (
          <p className="text-center text-gray-500 py-3">No friends</p>
        )}
        <ul>
          {Friends.map((friend, index) => (
            <li key={index} className={`flex items-center justify-between gap-4 rounded-lg p-2 hover:bg-gray-300 transition duration-300 ease-in-out ${selectedChatroom?.friend === friend.username ? 'bg-gray-300' : ''}`} onClick={() => createChatroom(friend)}>
              <div className="flex items-center ">
                <div className="relative inline-block rounded-full n h-9 w-9 md:h-11 md:w-11">
                  <img src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + friend?.avatar} className="object-cover rounded-full w-full h-full" alt={friend.username} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friend.is_online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="whitespace-nowrap overflow-hidden overflow-ellipsis px-3">
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-xs text-gray-500">{friend.is_online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <FriendPopup friend={friend} user={user} />
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default FriendsList;