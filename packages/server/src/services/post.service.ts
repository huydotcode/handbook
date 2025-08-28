import { SortOrder } from 'mongoose';
import Post from '../models/post.model';
import PostInteraction from '../models/post_interaction.model';
import { POPULATE_GROUP, POPULATE_USER } from '../utils/populate';
import { IPost } from '../types';

interface GetPostsOptions {
    filter: Record<string, any>;
    userId: string;
    page?: number;
    sort?: Record<string, SortOrder>;
    pageSize?: number;
}

export async function getPostsWithInteraction({
    filter,
    userId,
    sort = { createdAt: -1, loves: -1 },
    page = 1,
    pageSize = 3,
}: GetPostsOptions) {
    const posts = await Post.find({
        ...filter,
        status: 'active',
    })
        .populate('media')
        .populate('author', POPULATE_USER)
        .populate(POPULATE_GROUP)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean<IPost[]>();

    const postIds = posts.map((p) => p._id);
    const interactions = await PostInteraction.find({
        post: { $in: postIds },
        user: userId,
        type: { $in: ['love', 'share', 'save'] },
    }).lean();

    const interactionMap = new Map();
    interactions.forEach((inter) => {
        const postId = inter.post.toString();
        if (!interactionMap.has(postId)) {
            interactionMap.set(postId, {
                love: false,
                share: false,
                save: false,
            });
        }
        interactionMap.get(postId)[inter.type] = true;
    });

    posts.map((post) => {
        const postIdStr = post._id.toString();
        const interaction = interactionMap.get(postIdStr) || {
            love: false,
            share: false,
            save: false,
        };
        console.log('Post', post._id, 'Interaction', interaction);
        post.userHasLoved = interaction.love;
        post.userHasShared = interaction.share;
        post.userHasSaved = interaction.save;

        return post;
    });

    return posts;
}
