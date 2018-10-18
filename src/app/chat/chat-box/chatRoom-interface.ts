export interface chatRoom {
    chatRoomId?: string,
    chatRoomName: string,
    ownerId: string,
    ownerName:string,
    chatRoomMembers?: [{userId,userName}],
}