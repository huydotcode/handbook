export const API_ROUTES = {
    AUTH: {
        SIGN_UP: '/api/auth/signup',
    },
    USER: {
        FRIENDS: '/user/friends',
    },
    GEMINI: {
        CHAT: '/api/gemini',
    },
    POSTS: {
        CREATE: '/post/create',
        ID: (id: string) => `/posts/${id}`,
    },
    UPLOAD: {
        IMAGE: '/upload/image',
        VIDEO: '/upload/video',
    },
    SAVED_POSTS: {
        INDEX: '/saved-posts',
    },
    IMAGES: {
        INDEX: '/api/images',
    },
    COMMENTS: {
        INDEX: '/comments',
        REPLY: '/comments/reply',
    },
    NOTIFICATIONS: {
        INDEX: '/notifications',
    },
    CONVERSATIONS: {
        ID: (id: string) => `/conversations/${id}`,
        GET_BY_USER: (userId: string) => `/conversations?user_id=${userId}`,
    },
    GROUP: {
        JOINED: '/groups/joined',
    },
    MESSAGES: {
        INDEX: '/message',
        PINNED: '/message/pinned',
        SEARCH: `/message/search`,
        SEARCH_QUERY: ({
            type,
            q,
            page,
            pageSize,
        }: {
            type: string;
            q: string;
            page: number;
            pageSize: number;
        }) =>
            `/search${type ? `/${type}` : ''}?q=${encodeURIComponent(q)}&page=${page}&page_size=${pageSize}`,
    },
    REQUESTS: {
        INDEX: '/requests',
    },
    ITEMS: {
        QUERY: (page: number, pageSize: number) =>
            `/items?page=${page}&page_size=${pageSize}`,
    },
    LOCATIONS: {
        INDEX: '/locations',
    },
};
