import {getAPI } from "./APIServices";


export const getFriends = async () => {
    return getAPI("get_friends")
        .then((res: any) => {
            if (res.status !== 200)
                throw new Error("Failed to fetch data");
            return res;
        })
}




export const getRooms = async (id: string): Promise<Chatroom[]> => {
       return  getAPI('chat/rooms/').then((res: any) => {
        
        if (res.status !== 200) {
            throw new Error('Failed to fetch data');
        }
        if (!id )
            id = localStorage.getItem('user_id') as string;
  
        const rooms: Chatroom[] = res.data.map((room: any) => ({
            id: room.id,
            last_message: room.last_message,
            last_message_timestamp: room.last_send_time,
            friend_id: room.user1 == id ? room.user2 : room.user1,
            friend: room.user1 == id ? room.user2_username : room.user1_username,
            friend_avatar: room.user1 == id ? room.user2_avatar : room.user1_avatar,
            last_sender: room.last_sender == id ? 1 : 0,
            unread_count: room.last_sender == id ? 0 : room.unread_count,
        }));
        
        return rooms;
    }
    );
};




export const getMessages = async (id: string, cursor :string): Promise<any> => {
    if (cursor != '') {
        return getAPI(`chat/${id}/messages?cursor=${cursor}`).then((res: any) => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            if (res.data.results.length > 0) {
                return {
                    status: res.status,
                    data: res.data
                }
            }
            else{
                return getMessages(id,'');
            }

        }
        );
    }
    else
    
        return getAPI(`chat/${id}/messages`).then((res: any) => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            return {
                status: res.status,
                data: res.data
            }
        }
        );

}