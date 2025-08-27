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

interface IMedia {
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
    avatar: IMedia;
    members: IMemberGroup[];
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
    media: IMedia[];
    sender: IUser;
    conversation: IConversation;
    isPin: boolean;
    readBy: {
        user: IUser;
        readAt: Date;
    }[];
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

    extra?: {
        postId?: string;
        commentId?: string;
        groupId?: string;
        messageId?: string;
        notificationId?: string;

        [key: string]: any;
    };

    isDeleted: boolean;
    deletedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}

interface IPost {
    _id: string;
    option: string;
    text: string;
    media: IMedia[];
    author: IUser;

    group: IGroup | null;

    commentsCount: number;
    lovesCount: number;
    sharesCount: number;

    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    type: 'default' | 'group';
    status: 'active' | 'pending' | 'rejected';

    userHasLoved: boolean;
    userHasSaved: boolean;
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
    isVerified: boolean;

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
    joinedAt: Date;
}

interface IConversation {
    _id: string;
    title: string;
    creator: IUser;
    participants: IUser[];
    lastMessage: IMessage;
    group?: IGroup;
    type: string;
    status: string;
    avatar: IMedia;
    pinnedMessages: IMessage[];
    isDeletedBy: string[];
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
    images: IMedia[];
    location: ILocation;
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
