interface Post {
    _id: string;
    option: string;
    content: string;
    creator: {
        _id: string;
        name: string;
        image: string;
    };
    shares: number;
    loves: string[];
    images: any[];
    createdAt: Date;
    updatedAt: Date;
    commentCount: number;
}

interface ReactionType {
    reactionType: string;
    userId: string;
    _id?: string;
}

interface User {
    _id: string;
    email: string;
    name: string;
    image: string;
    password?: string;
    given_name: string;
    family_name: string;
    locale: string;
    friends: any[];
    followers: any[];
    following: any[];
    notifications: any[];
    request: any[];
    createdAt: Date;
    updatedAt: Date;
}

interface Params {
    params: {
        postId?: string;
        userId?: string;
        commentId?: string;
        query?: any;
    };
}

interface IPostContext {
    user: User;
    post: Post;
    comments: Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    countComments: number;
    setCountComments: React.Dispatch<React.SetStateAction<number>>;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}
