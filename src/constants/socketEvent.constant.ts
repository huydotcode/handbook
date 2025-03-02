interface SocketEvent {
    SEND_REQUEST_ADD_FRIEND: string;
    ACCEPT_FRIEND: string;
    RECEIVE_NOTIFICATION: string;
    JOIN_ROOM: string;
    LEAVE_ROOM: string;
    READ_MESSAGE: string;
    SEND_MESSAGE: string;
    RECEIVE_MESSAGE: string;
    DELETE_MESSAGE: string;
    LIKE_POST: string;
}

const socketEvent: SocketEvent = {
    // FRIEND REQUEST
    SEND_REQUEST_ADD_FRIEND: 'send-request-add-friend',
    ACCEPT_FRIEND: 'accept-friend',

    // NOTIFICATION
    RECEIVE_NOTIFICATION: 'receive-notification',

    // Message
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',

    READ_MESSAGE: 'read-message',
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message',
    DELETE_MESSAGE: 'delete-message',

    // Post
    LIKE_POST: 'like-post',
};

export default socketEvent;
