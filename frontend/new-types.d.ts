
interface UserType {
    username: string;
    email: string;
    nickname: string;
    avatar: string;
    "is_friend"?: boolean;
    "request_sent"?: boolean;
    "request_received"?: boolean;
    blocked_by_you?: boolean;
    id : number;
    is_online: boolean;
}

interface MessageType {
    type: string;
    chatroom_id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
    type: string;
    id: number;
}

interface Chatroom {
    id: number;
    last_message: string;
    last_message_timestamp: string;
    friend_id: number;
    friend: string;
    friend_avatar: string;
    last_sender: number;
    unread_count: number;
}
