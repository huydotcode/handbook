interface User {
    comparePassword(password: string): unknown;
    id: string;
    name: string;
    image: string;
    email: string;
}

interface Comment {
    _id: string;
    content: string;
    postId: string;
    userInfo: {
        id: string;
        name: string;
        image: string;
    };
    parent_id: string;
    replies: string[];
    reactions: ReactionType[];
    createdAt: Date;
    updatedAt: Date;
    show?: boolean;
    isDeleted: boolean;
}

interface CloudinaryImage {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: any[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    api_key: string;
    user_id: string;
}

interface IProfile {
    userId: string;
    coverPhoto: string;
    profilePicture: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IMessage {
    _id: string;
    userId: string;
    roomId: string;
    text: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
