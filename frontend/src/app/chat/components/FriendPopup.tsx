import React, { useState, useEffect, useRef } from 'react';
import {postAPI} from '@/api/APIServices';
import { block } from '@/api/users';
import { useRouter } from "next/navigation";





type FriendType = {
  id: number;
  username: string;
  avatar: string;
};

const FriendPopup = ({ friend , user }: { friend: FriendType, user: UserType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInvite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const response = await postAPI("notifications/send_game_invite", { 
      sender: user.username,
      receiver: friend.username
  })

  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    block(friend.username);
    router.push(`/user/${friend.username}`);
  };

  const handleProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    router.push(`/user/${friend.username}`);
  };

  return (
    <div className="relative inline-block text-left">
      <button onClick={togglePopup} className="text-sm text-myred">
        ...
      </button>
      {isOpen && (
        <div ref={popupRef} className="fixed z-50  w-45 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button onClick={handleInvite} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Invite to Game
            </button>
            <button onClick={handleBlock} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Block User
            </button>
            <button onClick={handleProfile} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              View Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendPopup;
