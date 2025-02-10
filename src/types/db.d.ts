interface User {
    comparePassword(password: string): unknown;
    id: string;
    name: string;
    image: string;
    email: string;
    password: string;
}

interface IComment {
    _id: string;
    text: string;
    author: IUser;
    replyComment: IComment;
    loves: IUser[];
    post: IPost;
    isDeleted: boolean;
    hasReplies: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface ILocation {
    _id: string;
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
    code: string;
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
    avatar: IImage;
    members: {
        _id: string;
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
    images: IImage[];
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
    comments_count: number;
    createdAt: Date;
    updatedAt: Date;
    type: 'default' | 'group';
    status: 'active' | 'pending' | 'rejected';
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
    groups: IGroup[];
    followersCount: number;

    isOnline: boolean;
    isBlocked: boolean;

    lastAccessed: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IFollows {
    _id: string;
    follower: IUser;
    following: IUser;
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
    participants: IUser[];
    lastMessage: IMessage;
    group?: IGroup;
    type: string;
    status: string;
    avatar: IImage;
    createdAt: Date;
    updatedAt: Date;
}

interface IConversationRole {
    _id: string;
    conversationId: string;
    userId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ICategory {
    _id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IItem {
    _id: string;
    name: string;
    seller: IUser;
    description: string;
    price: number;
    images: IImage[];
    location: string;
    category: ICategory;
    slug: string;
    status: string;
    attributes: {
        name: string;
        value: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

interface ISavedPost {
    _id: string;
    userId: IUser;
    posts: IPost[];
    createdAt: Date;
    updatedAt: Date;
}
