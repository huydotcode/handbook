import { getAuthSession } from '@/lib/auth';
import Post from '@/models/Post';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { Session } from 'next-auth';

export const POST = async (request: Request) => {
    logger('API CREATE POST');
    const req = await request.json();
    const { option, content, images } = req;

    const session = (await getAuthSession()) as Session;
    if (!session) return new Response('Unauthorized', { status: 401 });

    try {
        await connectToDB();

        const user = await User.findById(session.user.id).populate(
            'name image'
        );

        const newPost = await new Post({
            option: option,
            content: content,
            images: images,
            creator: user,
        });

        await newPost.save();

        return new Response(
            JSON.stringify({ msg: 'Success to create post', post: newPost }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(`Error: ${error}`, { status: 500 });
    }
};
