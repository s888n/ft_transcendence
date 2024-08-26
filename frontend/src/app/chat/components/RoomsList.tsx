import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSocket } from '@/contexts/SocketProvider';
import { getRooms } from '@/api/chat';
import UserContext from '@/contexts/UserContext';
import { BiMessageAdd } from "react-icons/bi";
import { ChatContext } from '@/contexts/ChatProvider';

interface RoomsListProps {
    rooms: Chatroom[];
    selectedChatroom: Chatroom | null;
    setSelectedChatroom: (chatroom: Chatroom) => void;
}

const RoomsList: React.FC<RoomsListProps> = ({ selectedChatroom, setSelectedChatroom }) => {
    const { sendMessage, onMessage, sendReadEvent } = useSocket();
    const [roomList, setRoomList] = useState<Chatroom[]>([]);
    const { user } = useContext(UserContext);
    const chatContext = useContext(ChatContext);

    if (!chatContext) {
        throw new Error("ChatBox must be used within a ChatProvider");
    }

    const { refresh, setRefresh, messages, setMessages } = chatContext;


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
            setRoomList(res);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [user]);

    useEffect(() => {

        fetchRooms();
    }, [refresh, selectedChatroom, messages]);

    useEffect(() => {
        const handleMessage = (incomingMessage: any) => {
            if (incomingMessage.type == "private.message") {
                fetchRooms();
            }
        };

        const cleanup = onMessage(handleMessage);

        return () => {
            cleanup(); // Unsubscribe when component unmounts
        };
    }, [onMessage, sendMessage]);



    const handleRoomClick = (room: Chatroom) => {
        if (selectedChatroom && room.id === selectedChatroom.id) {
            return;
        }
        setSelectedChatroom(room);
        if (user) {
            sendReadEvent(room.id, user.id, room.friend_id);
        } else {
            console.error("User is undefined");
        }
        setRefresh(!refresh);
    };

    return (
        <div className="mt-1">
            <h3 className="text-lg text-myred font-semibold mb-1 px-2">Conversations</h3>
            <aside className="py-1">
                {roomList.length === 0 && (
                    <p className="text-gray-500 text-center py-3">No conversations yet</p>
                )}
                <ul>
                    {roomList.map((room) => (
                        <li
                            key={room.id} // Use room.id as key instead of index
                            className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out ${selectedChatroom && selectedChatroom.id === room.id ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => handleRoomClick(room)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <div className="relative inline-block rounded-full  overflow-hidden h-9 w-9 md:h-11 md:w-11">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${room.friend_avatar}`}
                                            className="object-cover rounded-full w-full h-full"
                                            alt={room.friend}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis px-3">
                                        <p className="font-semibold">{room.friend}</p>
                                        <p className={`text-sm text-gray-500 max-w-[15vw] line-clamp-1 ${room.unread_count ? 'font-semibold' : ''} `}> {room.last_sender && room.last_message ? 'You :' : ''}  {room.last_message || 'No messages yet'}</p>
                                    </div>
                                </div>
                                {room.unread_count > 0 && room?.id != selectedChatroom?.id && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-myred text-white rounded-full">
                                        {room.unread_count}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default RoomsList;
