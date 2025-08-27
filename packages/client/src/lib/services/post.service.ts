import {
    createPost,
    deletePost,
    editPost,
    getPostByPostId,
    getSavedPosts,
    savePost,
    sendReaction,
    sharePost,
    unsavePost,
    updateStatusPost,
} from '../actions/post.action';

interface IPostService {
    getById(id: string): Promise<IPost | null>;
    getSavedByUserId?(userId: string): Promise<IPost[]>;
    create: ({
        content,
        mediaIds,
        option,
        groupId,
        type,
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        groupId?: string | null;
        type?: string;
    }) => Promise<IPost>;
    update: ({
        content,
        mediaIds,
        option,
        postId,
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        postId: string;
    }) => Promise<IPost>;
    sendReaction: (postId: string) => Promise<boolean>;
    delete: (postId: string) => Promise<boolean>;

    updateStatus: ({
        postId,
        status,
        path,
    }: {
        postId: string;
        status: string;
        path: string;
    }) => Promise<boolean>;

    savePost: ({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }) => Promise<boolean>;

    unsavePost: ({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }) => Promise<boolean>;
}

class PostServiceClass implements IPostService {
    async getById(id: string): Promise<IPost | null> {
        const post = await getPostByPostId({ postId: id });

        if (!post) {
            throw new Error(`Post with ID ${id} not found`);
        }

        return post;
    }

    async getSavedByUserId(userId: string): Promise<IPost[]> {
        const posts = await getSavedPosts({ userId });
        return posts;
    }

    async create({
        content,
        mediaIds,
        option,
        groupId = null,
        tags = [],
        type = 'default',
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        groupId?: string | null;
        type?: string;
        tags?: string[];
    }): Promise<IPost> {
        const newPost = await createPost({
            content,
            mediaIds,
            option,
            groupId,
            type,
            tags,
        });

        return newPost;
    }

    async update({
        content,
        mediaIds,
        option,
        postId,
        tags = [],
    }: {
        content: string;
        mediaIds: string[];
        option: string;
        postId: string;
        tags?: string[];
    }): Promise<IPost> {
        const updatedPost = await editPost({
            content,
            mediaIds,
            option,
            postId,
            tags,
        });

        return updatedPost;
    }

    async sendReaction(postId: string): Promise<boolean> {
        const result = await sendReaction({
            postId,
        });
        return result;
    }

    async share(postId: string): Promise<boolean> {
        const result = await sharePost({
            postId,
        });
        if (!result) {
            throw new Error(`Failed to share post with ID ${postId}`);
        }
        return result;
    }

    async delete(postId: string): Promise<boolean> {
        const result = await deletePost({
            postId,
        });
        return result;
    }

    async updateStatus({
        postId,
        status,
        path,
    }: {
        postId: string;
        status: string;
        path: string;
    }): Promise<boolean> {
        const result = await updateStatusPost({
            postId,
            status,
            path,
        });
        return result;
    }

    async savePost({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }): Promise<boolean> {
        const result = await savePost({
            postId,
            path,
        });

        if (!result) {
            throw new Error(`Failed to save post with ID ${postId}`);
        }

        return result;
    }

    async unsavePost({
        postId,
        path,
    }: {
        postId: string;
        path: string;
    }): Promise<boolean> {
        const result = await unsavePost({
            postId,
            path,
        });

        if (!result) {
            throw new Error(`Failed to unsave post with ID ${postId}`);
        }

        return result;
    }
}

const PostService = new PostServiceClass();
export default PostService;
