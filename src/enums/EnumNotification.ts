export enum NotificationType {
    REQUEST_ADD_FRIEND = 'request-add-friend',
    ACCEPT_FRIEND_REQUEST = 'accept-friend-request',
    REJECT_FRIEND_REQUEST = 'reject-friend-request',
    MESSAGE = 'message',
    FOLLOW_USER = 'follow-user',
}

export enum NotificationMessage {
    REQUEST_ADD_FRIEND = 'đã gửi cho bạn một lời mời kết bạn',
    ACCEPT_FRIEND_REQUEST = 'đã chấp nhận lời mời kết bạn của bạn',
    REJECT_FRIEND_REQUEST = 'đã từ chối lời mời kết bạn của bạn',
    MESSAGE = 'đã gửi cho bạn một tin nhắn',
    FOLLOW_USER = 'đã theo dõi bạn',
}
