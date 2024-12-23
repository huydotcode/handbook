type TODO = any;

interface ISessionUser {
    id: string;
    name: string;
    image: string;
    email: string;
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
    comments: IComment[];
    countAllComments: number;
    countAllParentComments: number;
}

interface IPostContext {
    post: IPost;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
    countAllComments: number;
    setCountAllComments: React.Dispatch<React.SetStateAction<number>>;
}

interface IFriend {
    _id: string;
    name: string;
    username: string;
    avatar: string;
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
    files: File[];
}

interface GemimiChatMessage {
    text: string;
    isGemini: boolean;
    createAt: Date;
}
