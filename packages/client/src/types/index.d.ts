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

interface IFriend {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastAccessed: Date;
}

interface IFollow {
    _id: string;
    follower: IUser;
    following: IUser;
    createdAt: Date;
    updatedAt: Date;
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
    tags: string[];
}

interface GemimiChatMessage {
    text: string;
    isGemini: boolean;
    createAt: Date;
}

interface ICloudinaryImage {
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
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    original_filename: string;
    api_key?: string; // Optional, depending on your use case
}
//  "asset_id": "0220e4eb940202cca55b5ce35eb64e04",
//         "public_id": "uploads/nryfefbzcyf2fj1fjpsl",
//         "version": 1748072065,
//         "version_id": "df9647cc75168e8e26201035241ebb23",
//         "signature": "f107b05a952d65acd20697cbb8f47cac9289548b",
//         "width": 1920,
//         "height": 1920,
//         "format": "jpg",
//         "resource_type": "image",
//         "created_at": "2025-05-24T07:34:25Z",
//         "tags": [],
//         "bytes": 1026789,
//         "type": "upload",
//         "etag": "fe8453f20b348d6dc47ae7ed9f875377",
//         "placeholder": false,
//         "url": "http://res.cloudinary.com/da4pyhfyy/image/upload/v1748072065/uploads/nryfefbzcyf2fj1fjpsl.jpg",
//         "secure_url": "https://res.cloudinary.com/da4pyhfyy/image/upload/v1748072065/uploads/nryfefbzcyf2fj1fjpsl.jpg",
//         "folder": "uploads",
//         "original_filename": "file",
//         "api_key": "533638155798775"
