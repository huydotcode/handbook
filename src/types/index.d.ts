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

const sendComment = async ({
    valueInput,
    replyTo = null,
    setIsSending,
    setValueInput,
}: {
    valueInput: string;
    replyTo: string | null;
    setIsSending: any;
    setValueInput: any;
}) => {
    try {
        if (valueInput.replaceAll('<p><br></p>', '').trim().length === 0) {
            toast.error('Vui lòng nhập trước khi gửi!');
            return;
        }

        await fetch(`/api/posts/${post._id}/comments/new`, {
            method: 'POST',
            body: JSON.stringify({
                content: valueInput.replace(/\n/g, '<br/>'),
                userId: session?.user.id,
                replyTo: replyTo,
            }),
        });

        setCountComments((prev) => prev + 1);
    } catch (error: any) {
        toast.error(error);
    } finally {
        setIsSending(false);
        setValueInput('');
    }
};

interface IPostContext {
    user: User;
    post: Post;
    comments: Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    countComments: number;
    setCountComments: React.Dispatch<React.SetStateAction<number>>;
    sendComment: (props: {
        valueInput: string;
        replyTo: string | null;
        setIsSending: any;
        setValueInput: any;
    }) => Promise<any>;
    deleteComment: (commentId: string) => void;
    setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
}
