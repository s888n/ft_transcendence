"use client"
import { useState, useEffect } from 'react';
import { getAPI, postAPI } from '@/api/APIServices';


const getFriends = async () => {
    const response = await getAPI("get_friends")
        .then((res: any) => {
            if (res.status === 200) {
                return res.data?.friends.filter((friend: any) => friend.is_online === true);
            }
        });
    return response;
}

interface FriendsModalProps {
    username: string;
    setShowFriendsModal: (show: boolean) => void;
}

export default function FriendsModal({
    username,
    setShowFriendsModal
}: FriendsModalProps) {
    const [friends, setFriends] = useState<UserType[] | undefined>([]);
    useEffect(() => {
        getFriends().then((data) => {
            setFriends(data);
        });
    }, []);
    const sendInvite = async (sender: string, receiver: string) => {
        const response = await postAPI("notifications/send_game_invite", {
            sender: sender,
            receiver: receiver
        })
            .then((res: any) => {
                if (res.status === 200) {
                    return res.data;
                }
            });
        return response;
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 font-bold">
                <h2 className="text-2xl  text-center mb-4 text-myred ">Friends</h2>
                <ul>
                    {friends?.length === 0 && <p className="text-center">No friends online</p>}
                    {friends?.map((friend) => (
                        <li key={friend.username} className="flex items-center justify-between">
                            <img src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + friend?.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                            <p>{friend.username}</p>
                            <button className="bg-myred text-white px-4 py-2 rounded-lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.disabled = true;
                                    e.currentTarget.innerText = "Invited";
                                    e.currentTarget.classList.add("bg-gray-300");
                                    sendInvite(username, friend.username);

                                }
                                }>
                                Invite
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="bg-myred text-white px-4 py-2 rounded-lg mt-4 w-full"
                    onClick={() => setShowFriendsModal(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}
