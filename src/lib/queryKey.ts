export const queryKey = {
    search: ({
        q,
        type,
    }: {
        q: string | undefined;
        type: string | undefined;
    }) => ['search', q, type],

    conversations: {
        index: ['conversations'],
        userId: (userId: string | undefined) => ['conversations', userId],
        id: (conversationId: string | undefined) => [
            'conversation',
            conversationId,
        ],
    },

    messages: {
        conversationId: (conversationId: string | undefined) => [
            'messages',
            conversationId,
        ],
        lastMessage: (conversationId: string | undefined) => [
            'lastMessage',
            conversationId,
        ],
        pinnedMessages: (conversationId: string | undefined) => [
            'pinnedMessages',
            conversationId,
        ],
    },

    user: {
        id: (userId: string | undefined) => ['user', userId],
        profile: (userId: string | undefined) => ['profile', userId],
        followers: (userId: string | undefined) => ['followers', userId],
        friends: (userId: string | undefined) => ['friends', userId],
        requests: (userId: string | undefined) => ['requests', userId],
        notifications: (userId: string | undefined) => [
            'notifications',
            userId,
        ],
        groups: (userId: string | undefined) => ['groups', userId],
    },

    posts: {
        newFeed: ({
            type,
            userId,
            groupId,
            username,
        }: {
            type: string | undefined;
            userId: string | undefined;
            groupId: string | undefined;
            username: string | undefined;
        }) => ['posts', type, userId, groupId, username],
        id: (postId: string | undefined) => ['post', postId],
        all: () => ['posts'],
        saved: (userId: string | undefined) => ['savedPosts', userId],
        comments: (postId: string | undefined) => ['comments', postId],
        replyComments: (commentId: string | undefined) => [
            'replyComments',
            commentId,
        ],
    },

    locations: ['locations'],
    categories: ['categories'],
    items: {
        index: ['items'],
        id: (itemId: string | undefined) => ['item', itemId],
    },
};

export default queryKey;
