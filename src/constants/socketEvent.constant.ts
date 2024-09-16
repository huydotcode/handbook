interface SocketEvent {
    [key: string]: string;
}

const socketEvent: SocketEvent = {
    // FRIEND REQUEST
    SEND_REQUEST_ADD_FRIEND: 'send-request-add-friend',
    ACCEPT_FRIEND: 'accept-friend',

    // NOTIFICATION
    RECEIVE_NOTIFICATION: 'receive-notification',

    // Message
    JOIN_ROOM: 'join-room',
    READ_MESSAGE: 'read-message',
    SEND_MESSAGE: 'send-message',
    GET_LAST_MESSAGE: 'get-last-message',
    RECEIVE_MESSAGE: 'receive-message',
    DELETE_MESSAGE: 'delete-message',
};

export default socketEvent;
