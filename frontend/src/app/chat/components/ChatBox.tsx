import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useSocket } from '@/contexts/SocketProvider';
import { getMessages } from '@/api/chat';
import UserContext from '@/contexts/UserContext';
import { ChatContext } from '@/contexts/ChatProvider';
import { Flip, ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";


import Image from 'next/image';





const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  }
};

type ChatBoxProps = {
  selectedChatroom: Chatroom
};



const ChatBox = ({ selectedChatroom }: ChatBoxProps) => {
  const { sendMessage, onMessage, sendReadEvent } = useSocket();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState('');
  const [fetchingMoreMessages, setFetchingMoreMessages] = useState(false);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();

  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error("ChatBox must be used within a ChatProvider");
  }

  const { refresh, setRefresh, messages, setMessages } = chatContext;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      return;
    }
    if (selectedChatroom && user) {
      sendMessage(message, selectedChatroom.id, user.id, selectedChatroom.friend_id, 'message');
      // setMessages((prevMessages: MessageType[]) => [...prevMessages, {
      //   id: Date.now() + Math.random(),
      //   chatroom_id: selectedChatroom.id,
      //   sender: user.id,
      //   receiver_id: selectedChatroom.friend_id,
      //   message : message,
      //   created_at: new Date().toISOString(),
      //   type: 'message'
      // }]);
      selectedChatroom.last_message = message;
      setMessage('');
      setRefresh(true);
      scrollToBottom();
    } else {
      console.error('No chatroom selected');
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchMessages = async (append = false) => {
    const res = await getMessages(String(selectedChatroom.id), cursor);
    if (res.status === 200) {

      const newMessages = res.data.results.reverse();
      setMessages(prevMessages => append ? [...newMessages, ...prevMessages] : newMessages);
      if (res.data.next) {
        setCursor(res.data.next.split('=')[1]);
      } else {
        setCursor('');
      }
    }
  };

  useEffect(() => {
    const resetCursor = () => {
      return () => setCursor('');
    }
    resetCursor();
    setMessages([]);
    fetchMessages();
    setInitialLoad(false);
  }, [selectedChatroom]);

  useEffect(() => {
    const handleMessage = (incomingMessage: MessageType) => {
      if (incomingMessage.type === 'private.message' &&
        incomingMessage.chatroom_id === selectedChatroom.id && user) {
        setMessages((prevMessages: MessageType[]) => [...prevMessages, {
          id: Date.now() + Math.random(),
          chatroom_id: incomingMessage.chatroom_id,
          sender_id: incomingMessage.sender_id,
          receiver_id: incomingMessage.receiver_id,
          message: incomingMessage.message,
          created_at: incomingMessage.created_at,
          type: 'message'
        }
        ])
        sendReadEvent(selectedChatroom.id, user.id, selectedChatroom.friend_id);
        setRefresh(true);
      }
      if (incomingMessage.type === 'Chatroom not found') {
        if (toast.isActive("Chatroom not found"))
          return;
        toast.error("Chatroom not found", {
          position: "top-center",
          autoClose: 3000,
        });
        window.location.reload();
      }
    };

    const unsubscribe = onMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [selectedChatroom.id, onMessage, setMessages]);

  useEffect(() => {
    if (!fetchingMoreMessages) {
      scrollToBottom();
    }
  }, [messages]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScroll = () => {
    if (!initialLoad && scrollableRef.current && scrollableRef.current.scrollTop <= 10) {
      if (!fetchingMoreMessages && cursor) {
        setFetchingMoreMessages(true);
        fetchMessages(true).then(() => setFetchingMoreMessages(false));
      }
    }
  };









  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        <div ref={scrollableRef} className="h-[85vh] overflow-y-auto p-2" onScroll={handleScroll}>
          {messages.length > 0 ? (
            <div className="flex flex-col w-full mt-2">
              {messages.map((message, index) => {
                const showDate =
                  index === 0 ||
                  new Date(message.created_at).toDateString() !==
                  new Date(messages[index - 1].created_at).toDateString();

                return (
                  <React.Fragment key={`${message.id}-${index}`}>
                    {showDate && (
                      <div className="text-center text-gray-500 my-2">
                        {formatDate(message.created_at)}
                      </div>
                    )}
                    <div className={`flex ${message.sender_id == user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                      {message.sender_id !== user?.id && (
                        <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
                          <img
                            src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${message.sender_id == user?.id ? user?.avatar : selectedChatroom.friend_avatar}`}
                            className="object-cover rounded-full w-full h-full"
                            alt={message.sender_id === user?.id ? user?.username : selectedChatroom.friend}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className={`p-2 bg-gray-200 max-w-[60vw] rounded-lg ${message.sender_id == user?.id ? 'bg-myred' : ''} break-words whitespace-pre-wrap`}>
                        <p className={`${message.sender_id == user?.id ? 'text-white' : 'text-black'}`}>{message.message}</p>
                        <p className="text-xs text-gray-500">{formatTime(message.created_at)}</p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-3">No messages yet</p>
          )}
        </div>
        <div className="flex flex-row items-center bg-gray-100">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-grow resize-none overflow-hidden border-none px-2 py-1 m-1 bg-gray-300 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-opacity-50 rounded-lg"
            rows={1}
            maxLength={500}
          />
          <FaPaperPlane onClick={handleSendMessage} className="text-myred cursor-pointer ml-2 mr-2" size={22} />
        </div>
      </div>
    </>
  );
};

export default ChatBox;
