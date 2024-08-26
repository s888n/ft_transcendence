import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaBan, FaGamepad, FaUser } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { useRouter } from "next/navigation";
import { block } from '@/api/users';
import { postAPI } from '@/api/APIServices';


const Popup: React.FC<{ selectedChatroom: Chatroom, setIsPopupOpen: (isOpen: boolean) => void, user: UserType }> = ({ selectedChatroom, setIsPopupOpen, user }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsPopupOpen]);



  const handleBlockUser = () => {
    block(selectedChatroom.friend);
    router.push(`/user/${selectedChatroom.friend}`);
  };

  const handleInviteToGame = async () => {

    const response = await postAPI("notifications/send_game_invite", {
      sender: user.username,
      receiver: selectedChatroom.friend
    })
  };

  const handleViewProfile = () => {
    router.push(`/user/${selectedChatroom.friend}`);
  };

  return (
    <div className="fixed top-12 right-0 h-18 w-16 flex items-center justify-center">
      <div ref={popupRef} className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-6 w-60">
        <div className="flex flex-col items-center">
          <div className="relative inline-block rounded-full overflow-hidden h-14 w-14 mb-1">
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${selectedChatroom.friend_avatar}`}
              className="object-cover rounded-full w-full h-full"
              alt="User"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h2 className="font-semibold text-lg mb-2">{selectedChatroom.friend}</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              className="text-myred py-2 px-1 rounded flex items-center justify-between w-full mb-1 hover:bg-red-100"
              onClick={handleBlockUser}
            >
              <div className="flex items-center">
                <Icon icon="fa-solid:ban" className="text-myred w-6 h-6" />
                <span className="text-sm ml-2">Block User</span>
              </div>
            </button>

            <button
              className="text-myred py-2 px-1 rounded flex items-center justify-between w-full mb-1 hover:bg-red-100"
              onClick={handleInviteToGame}
            >
              <div className="flex items-center">
                <Icon icon="bi:joystick" className="text-myred w-6 h-6" />
                <span className="text-sm ml-2">Invite to Game</span>
              </div>
            </button>

            <button
              className="text-myred py-2 px-1 rounded flex items-center justify-between w-full mb-1 hover:bg-red-100"
              onClick={handleViewProfile}
            >
              <div className="flex items-center">
                <Icon icon="fa-solid:user" className="text-myred w-6 h-6" />
                <span className="text-sm ml-2">View Profile</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Popup;