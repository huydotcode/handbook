interface IPost {
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

interface ISessionUser {
    id: string;
    name: string;
    image: string;
    email: string;
}

interface IUser {
    _id: string;
    email: string;
    name: string;
    image: string;
    username: string;
    password?: string;
    given_name: string;
    family_name: string;
    locale: string;
    friends?: any[];
    followers?: any[];
    following?: any[];
    notifications?: any[];
    request?: any[];
    createdAt: Date;
    updatedAt: Date;
    lastAccessed: Date;
    role: string;
}

interface IParams {
    params: {
        postId?: string;
        userId?: string;
        commentId?: string;
        query?: any;
    };
}

interface ICommentState {
    comments: Comment[];
    countAllComments: number;
    countAllParentComments: number;
}

interface IPostContext {
    post: IPost;
    user: IUser;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
    commentState: ICommentState;
    setCommentState: React.Dispatch<React.SetStateAction<ICommentState>>;
}

interface IFriend {
    _id: string;
    name: string;
    image: string;
    isOnline: boolean;
    lastAccessed: Date;
}

interface IRoomChat {
    id: string;
    name: string;
    image: string;
    members: any[];
    messages: IMessage[];
    lastAccessed: Date;
    type: 'f' | 'r' | 'd' | 'c';
}

interface ILastMessage {
    roomId: string;
    data: IMessage;
}

interface ILoading {
    friends: boolean;
    messages: boolean;
}

interface IPostFormData {
    option: 'public' | 'friend' | 'private';
    content: string;
}
