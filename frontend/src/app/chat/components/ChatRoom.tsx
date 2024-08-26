import { useEffect, useState, useContext } from 'react';
import { Icon } from "@iconify/react";
import Image from "next/image";
import Popup from "./Popup";
import ChatBox from "./ChatBox";
import { useSocket } from '@/contexts/SocketProvider';
import { ChatContext } from '@/contexts/ChatProvider';






const ChatRoom: React.FC<{ user: UserType; selectedChatroom: Chatroom }> = ({ user, selectedChatroom }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const { sendMessage, onMessage, sendReadEvent } = useSocket();
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error("ChatBox must be used within a ChatProvider");
  }

  const { refresh, setRefresh, messages, setMessages } = chatContext;


  // update online status

  //ask for online status every 10 seconds
  sendMessage('', selectedChatroom.id, user.id, selectedChatroom.friend_id, 'get_online_status');

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChatroom) {
        sendMessage('', selectedChatroom.id, user.id, selectedChatroom.friend_id, 'get_online_status');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedChatroom]);

  useEffect(() => {
    handleMessage();
  }
    , [selectedChatroom, onMessage]);

  const handleMessage = () => {
    const handleOnlineStatus = (incomingMessage: any) => {
      if (incomingMessage.type === 'online_status') {
        setIsOnline(incomingMessage.status);
        setRefresh(!refresh);
      }
    };
    const cleanup = onMessage(handleOnlineStatus);
    return () => {
      cleanup();
    };
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-shrink-0 flex flex-row items-center justify-between px-4 py-3 border-b border-gray-300 bg-red-50">
        <div className="flex flex-row items-center gap-2">
          <div className="relative inline-block rounded-full  h-9 w-9">
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + (selectedChatroom.friend_avatar)}
              className="object-cover rounded-full w-full h-full"
              alt="User"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>

          </div>
          <div>
            <p className="font-semibold">{selectedChatroom.friend}</p>
            <p className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button className="text-myred hover:text-myred-500" onClick={togglePopup}>
            <Icon icon="akar-icons:more-horizontal" width="24" height="24" />
          </button>
        </div>
      </div>
      {isPopupOpen && <Popup selectedChatroom={selectedChatroom} setIsPopupOpen={setIsPopupOpen} user={user} />}

      <ChatBox selectedChatroom={selectedChatroom} />

    </div>
  );

}

export default ChatRoom;
