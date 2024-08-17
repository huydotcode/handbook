interface User {
    comparePassword(password: string): unknown;
    id: string;
    name: string;
    image: string;
    email: string;
}

interface IComment {
    _id: string;
    text: string;
    author: IUser;
    replyComment: IComment;
    loves: IUser[];
    post: IPost;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IPrivateConversation {
    _id: string;
    members: IUser[];
    friend: IUser;
    status: string;
    background: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IGroupConversation {
    _id: string;
    name: string;
    avatar: string;
    description: string;
    creator: Types.ObjectId;
    members: IGroupMember[];
    group: IGroup;
    createdAt: Date;
    updatedAt: Date;
}

interface IImage {
    _id: string;
    publicId: string;
    width: number;
    height: number;
    resourceType: string;
    type: string;
    url: string;
    creator: IUser;
    createdAt: Date;
    updatedAt: Date;
}

interface IGroup {
    _id: string;
    name: string;
    description: string;
    avatar: string;
    members: {
        user: IUser;
        role: string;
    }[];
    creator: IUser;
    coverPhoto: string;
    type: string;
    introduction: string;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IProfile {
    _id: string;
    user: IUser;
    coverPhoto: string;
    bio: string;
    work: string;
    education: string;
    location: string;
    dateOfBirth: Date;

    createdAt: Date;
    updatedAt: Date;
}

interface IMessage {
    _id: string;
    text: string;
    images: string[];
    sender: IUser;
    conversation: IConversation;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface INotification {
    _id: string;

    sender: IUser;
    receiver: IUser;
    message: string;
    isRead: boolean;
    type: string;

    createdAt: Date;
    updatedAt: Date;
}

interface IPost {
    _id: string;
    option: string;
    text: string;
    images: IImage[];
    author: IUser;
    loves: IUser[];
    shares: IUser[];
    group: IGroup | null;
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    role: string;
    givenName: string;
    familyName: string;
    locale: string;

    friends: IUser[];
    followers: IUser[];

    isOnline: boolean;
    isBlocked: boolean;

    lastAccessed: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IMemberGroup {
    _id: string;
    user: IUser;
    role: string;
}

interface IConversation {
    _id: string;
    title: string;
    creator: string;
    participants: IParticipant[];
    group?: IGroup;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IParticipant {
    _id: string;
    conversation: IConversation;
    user: IUser;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
