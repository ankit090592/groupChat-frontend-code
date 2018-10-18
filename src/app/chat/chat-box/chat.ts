// definition of the interface 

export interface ChatMessage {
    chatId?: string,
    senderId: string,
    senderName: string,
    message: string,
    chatRoomId: string,        
    createdOn: Date       
}