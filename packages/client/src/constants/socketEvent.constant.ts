const socketEvent = {
    // FRIEND REQUEST
    SEND_REQUEST_ADD_FRIEND: 'send-request-add-friend',
    ACCEPT_FRIEND: 'accept-friend',

    // NOTIFICATION
    SEND_NOTIFICATION: 'send-notification',
    RECEIVE_NOTIFICATION: 'receive-notification',

    // Message
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',

    READ_MESSAGE: 'read-message',
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message',
    DELETE_MESSAGE: 'delete-message',
    PIN_MESSAGE: 'pin-message',
    UN_PIN_MESSAGE: 'un-pin-message',

    // Post
    LIKE_POST: 'like-post',
};

export default socketEvent;
