import { getAuthSession } from '@/lib/auth';
import { Group, Post, User } from '@/models';
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/services/mongoose';
import { Types } from 'mongoose';

const POPULATE_USER = 'name username avatar friends';
const POPULATE_GROUP = {
    path: 'group',
    populate: [
        { path: 'avatar' },
        { path: 'members.user' },
        { path: 'creator' },
    ],
};

type Params = Promise<{ req: NextRequest }>;

export const GET = async (
    request: NextRequest,
    segmentData: { params: Params }
) => {
    const searchParams = await request.nextUrl.searchParams;

    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 3;
    const groupId = searchParams.get('groupId');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const type = searchParams.get('type');
    const isManage = searchParams.get('isManage') === 'true';

    try {
        await connectToDB();

        const session = await getAuthSession();
        const query: any = {};

        // Kiểm tra xem có phải là user hiện tại không
        const isCurrentUser =
            userId === session?.user.id || username === session?.user.username;

        // Kiểm tra xem có phải là user hiện tại không
        if (userId !== 'undefined' && userId && type !== 'group') {
            query.author = isCurrentUser ? session?.user.id : userId;
        } else if (username !== 'undefined') {
            const user = await User.findOne({ username });
            if (user) {
                query.author = user.id;
            }
        }

        query.option = isCurrentUser
            ? { $in: ['public', 'private'] }
            : 'public';

        if (type === 'group') {
            query.type = 'group';

            if (groupId !== 'undefined' && groupId) {
                query.group = new Types.ObjectId(groupId);
            } else {
                const groupsHasJoin = await Group.find({
                    members: { $elemMatch: { user: session?.user.id } },
                }).distinct('_id');

                if (groupsHasJoin.length === 0) {
                    query.group = null;
                } else {
                    query.group = { $in: groupsHasJoin };
                }
            }
        } else {
            query.type = 'default';
        }

        query.status = isManage ? 'pending' : 'active';

        let posts = await Post.find(query)
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 })
            .populate('author', POPULATE_USER)
            .populate('images')
            .populate(POPULATE_GROUP)
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER);

        return NextResponse.json(posts, {
            status: 200,
        });
    } catch (error) {
        return new Response(`Error get posts ` + error, { status: 500 });
    }
};
