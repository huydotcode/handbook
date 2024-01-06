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
}

interface IRoomChat {
    id: string;
    name: string;
    image: string;
    members: any[];
    messages: IMessage[];
}

interface ILastMessage {
    roomId: string;
    data: IMessage;
}

interface ILoading {
    friends: boolean;
    messages: boolean;
}

/*
handleSocketAction('RECEIVE_MESSAGE');
        handleSocketAction('GET_LAST_MESSAGES');
        handleSocketAction('READ_MESSAGE');
        handleSocketAction('DELETE_MESSAGE');
        handleSocketAction('ADD_FRIEND');
        handleSocketAction('UN_FRIEND');
*/

// enum EChatAction {
//     GET_FRIENDS = 'GET_FRIENDS',
//     RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
//     GET_LAST_MESSAGES = 'GET_LAST_MESSAGES',
//     READ_MESSAGE = 'READ_MESSAGE',
//     DELETE_MESSAGE = 'DELETE_MESSAGE',
//     ADD_FRIEND = 'ADD_FRIEND',
//     UN_FRIEND = 'UN_FRIEND',
//     LOADING_FRIENDS = 'LOADING_FRIENDS',
//     LOADING_MESSAGES = 'LOADING_MESSAGES',
// }
