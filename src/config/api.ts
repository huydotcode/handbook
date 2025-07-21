export const API_ROUTES = {
    AUTH: {
        SIGN_UP: '/api/auth/signup',
        SEND_OTP: '/auth/send-otp',
        VERIFY_OTP: '/auth/verify-otp',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
        INDEX: '/api/user',
        FRIENDS: '/user/friends',
        FOLLOWINGS: (userId: string) =>
            `/user/follow/followings?user_id=${userId}`,
    },
    SEARCH: {
        INDEX: '/search',
        QUERY: ({
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
        USERS: '/search/users',
        POSTS: '/search/posts',
        GROUPS: '/search/groups',
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
    },
    REQUESTS: {
        INDEX: '/requests',
    },
    ITEMS: {
        QUERY: (page: number, pageSize: number) =>
            `/items?page=${page}&page_size=${pageSize}`,
        SEARCH: (query: string, page: number, pageSize: number) =>
            `/items/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
        BY_SELLER: (sellerId: string) => `/items/seller/${sellerId}`,
    },
    LOCATIONS: {
        INDEX: '/locations',
    },
    CATEGORIES: {
        INDEX: '/categories',
    },
};
