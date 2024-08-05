'use client'
import { postAPI } from "@/api/APIServices"
import Link from "next/link"
import { acceptRequest,rejectRequest } from "@/api/users"
export default function FriendRequestNotification(sender: string) {
    const handleAccept = () => {
        acceptRequest(sender)
    }
    const handleDecline = () => {
        rejectRequest(sender)
    }
    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full h-10 flex justify-center items-center">
                <p>
                    <span className="font-semibold px-1">
                        <Link href={`/user/${sender}`}>
                            {sender}
                        </Link>
                    </span>
                    has sent you a friend request.
                </p>
            </div>
            <div className="w-full h-10 flex justify-between">
                <button className="bg-red-500 text-white px-1 rounded"
                onClick={handleDecline}
                >Decline</button>
                <button className="bg-green-500 text-white px-1 rounded"
                onClick={handleAccept}
                >Accept</button>
            </div>
        </div>
    )
}