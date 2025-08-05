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

// VIDEO CALL EVENTS
export const VIDEO_CALL_EVENTS = {
    INITIATE_VIDEO_CALL: 'initiate-video-call',
    ACCEPT_VIDEO_CALL: 'accept-video-call',
    REJECT_VIDEO_CALL: 'reject-video-call',
    END_VIDEO_CALL: 'end-video-call',
    VIDEO_CALL_SIGNAL: 'video-call-signal',
    JOIN_VIDEO_ROOM: 'join-video-room',
    LEAVE_VIDEO_ROOM: 'leave-video-room',
    VIDEO_CALL_NOTIFICATION: 'video-call-notification',
    INCOMING_VIDEO_CALL: 'incoming-video-call',
    VIDEO_CALL_INITIATED: 'video-call-initiated',
    VIDEO_CALL_ACCEPTED: 'video-call-accepted',
    VIDEO_CALL_REJECTED: 'video-call-rejected',
    VIDEO_CALL_ENDED: 'video-call-ended',
    VIDEO_CALL_ERROR: 'video-call-error',
    VIDEO_ROOM_JOINED: 'video-room-joined',
    VIDEO_CALL_PARTICIPANT_LEFT: 'video-call-participant-left',
} as const;

export default socketEvent;
