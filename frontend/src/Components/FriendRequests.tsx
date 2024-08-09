import { FC, useRef, useEffect, useState, useContext } from 'react';
import UserContext from "@/contexts/UserContext";
import { IoClose } from 'react-icons/io5';
import { getFriendRequests } from "@/api/users";
import {
    cancelRequest,
    acceptRequest,
    rejectRequest,
  } from "@/api/users";

const FriendRequestPopup: FC<{ setDisplayFriendRequestPopup: (display: boolean) => void }> = ({ setDisplayFriendRequestPopup }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState<Array<any>>([]);

    useEffect(() => {

        const fetchFriendRequests = async () => {
            try {
                const res = await getFriendRequests();
                setFriendRequests(res.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedElement = event.target as Node;

            if (popupRef.current && !popupRef.current.contains(clickedElement)) {
                setDisplayFriendRequestPopup(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAcceptRequest = async (requestId: string) => {
        try {
           
            const res = await acceptRequest(requestId);
            if (res.status === 201) {
                setFriendRequests(prev => prev.filter(request => request.sender.username !== requestId));
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const res = await rejectRequest(requestId);
            if (res.status === 201) {
                setFriendRequests(prev => prev.filter(request => request.sender.username !== requestId));
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div
            ref={popupRef}
            className="absolute z-20 right-0   top-[90%] w-98 bg-white border shadow-lg rounded-lg"
        >
            <div className="p-4 flex justify-between items-center border-b">
                <span className="font-semibold text-gray-800">Friend Requests</span>
                <button onClick={() => setDisplayFriendRequestPopup(false)}>
                    <IoClose className="w-6 h-6 text-gray-600" />
                </button>
            </div>
            <div className="">
                {friendRequests.length > 0 ? (
                    friendRequests.map(request => (
                        <div
                            key={request.id}
                            className="flex items-center gap-5  p-3 border-b border-gray-200"
                        >
                            <img
                                className="w-10 h-10 rounded-full"
                                src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${request.sender.avatar}`}
                                alt={`${request.sender.username}'s avatar`}
                            />
                            <span className="truncate text-gray-700 font-bold">{request.sender.username}</span>
                            <div className="flex ml-auto gap-2">
                            <button
                                className="ml-auto px-1 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded transition"
                                onClick={() => handleAcceptRequest(request.sender.username)}
                            >
                                Accept
                            </button>
                            <button
                                className="ml-2 px-1 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded transition"
                                onClick={() => handleRejectRequest(request.sender.username)}
                            >
                                Reject
                            </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 w-98 text-center p-4">No friend requests</p>
                )}
            </div>
        </div>
    );
    
}

    

export default FriendRequestPopup;
