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

    // Video Call
    VIDEO_CALL_INITIATE: 'video-call-initiate',
    VIDEO_CALL_ACCEPT: 'video-call-accept',
    VIDEO_CALL_REJECT: 'video-call-reject',
    VIDEO_CALL_END: 'video-call-end',
    VIDEO_CALL_OFFER: 'video-call-offer',
    VIDEO_CALL_ANSWER: 'video-call-answer',
    VIDEO_CALL_ICE_CANDIDATE: 'video-call-ice-candidate',
    VIDEO_CALL_PARTICIPANT_JOINED: 'video-call-participant-joined',
    VIDEO_CALL_PARTICIPANT_LEFT: 'video-call-participant-left',
};

export default socketEvent;
