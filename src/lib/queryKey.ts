/* Search */
export const getSearchKey = (
    q: string | undefined,
    type: string | undefined
) => ['search', q, type];

/* Conversation & message key */
export const getConversationsKey = (userId: string | undefined) => [
    'conversations',
    userId,
];
export const getMessagesKey = (conversationId: string | undefined) => [
    'messages',
    conversationId,
];
export const getLastMessagesKey = (conversationId: string | undefined) => [
    'lastMessage',
    conversationId,
];
export const getPinnedMessagesKey = (conversationId: string | undefined) => [
    'pinnedMessages',
    conversationId,
];

export const getUserKey = (userId: string | undefined) => ['user', userId];
export const getProfileKey = (userId: string | undefined) => [
    'profile',
    userId,
];

/* Followers & friends key */
export const getFollowersKey = (userId: string | undefined) => [
    'followers',
    userId,
];

export const getFriendsKey = (userId: string | undefined) => [
    'friends',
    userId,
];

/* Notification & request keys */
export const getRequestsKey = (userId: string | undefined) => [
    'requests',
    userId,
];
export const getNotificationsKey = (userId: string | undefined) => [
    'notifications',
    userId,
];

export const getGroupsKey = (userId: string | undefined) => ['groups', userId];

/* Posts Key */
export const getNewFeedPostsKey = (
    type: string | undefined,
    userId: string | undefined,
    groupId: string | undefined,
    username: string | undefined
) => ['posts', type, userId, groupId, username];
export const getPostKey = (postId: string | undefined) => ['post', postId];
export const getPostsKey = () => ['posts'];
export const getSavedPostsKey = (userId: string | undefined) => [
    'savedPosts',
    userId,
];
export const getCommentsKey = (postId: string | undefined) => [
    'comments',
    postId,
];
export const getReplyCommentsKey = (commentId: string | undefined) => [
    'replyComments',
    commentId,
];

/* Other keys */
export const getLocationsKey = () => ['locations'];
export const getCategoriesKey = () => ['categories'];
export const getItemsKey = () => ['items'];
