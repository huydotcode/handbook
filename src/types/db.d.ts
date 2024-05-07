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
    desc: string;
    members: IUser[];
    status: string;
    unreadMessages: number;
    lastActivityAt: Date;
    background: string;
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

/*
name: string;
    description: string;
    avatar: string;
    members: GroupMember[];
    creator: Schema.Types.ObjectId;
    coverPhoto: string;
    type: string;
    introduction: string;
    lastActivity: Date;
*/

interface IGroupMember {
    user: IUser;
    role: string;
}

interface IGroup {
    _id: string;
    name: string;
    description: string;
    avatar: string;
    members: IGroupMember[];
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
    conversation: string;
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

/*
{
  _id: '65f791f23610b5dc36bbb0ad',
  option: 'public',
  text: 'Test',
  images: [],
  author: {
    _id: '65ed7f93eb5730906fe4fe69',
    username: 'ngonhuthuy1234',
    name: 'Huy Ngô',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKyBjwFh6fg9kfMEJ6-25Wui-_0cyFMCjvDiChzmRa4ng8S=s96-c'
  },
  loves: [],
  shares: [],
  group: null,
  createdAt: '2024-03-18T00:59:30.578Z',
  updatedAt: '2024-03-18T00:59:30.578Z',
  __v: 0
}
*/

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
